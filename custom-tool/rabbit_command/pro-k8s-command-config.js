/*************************************************
 * 變數卡牌
 *************************************************/
function addVar(name = '', value = '') {
  const div = document.createElement('div');
  div.className = 'var-block';
  div.innerHTML = `
    <label>變數名稱</label>
    <input value="${name}">
    <label>變數值</label>
    <textarea placeholder="換行,逗號,空格">${value}</textarea>
    <button>❌ 刪除</button>
  `;

  const input = div.querySelector('input');
  const textarea = div.querySelector('textarea');
  const btn = div.querySelector('button');

  input.addEventListener('input', saveVars);
  textarea.addEventListener('input', saveVars);

  btn.addEventListener('click', () => {
    div.remove();
    saveVars();
  });

  document.getElementById('vars').appendChild(div);
}


/*************************************************
 * 指令產生
 *************************************************/
function splitInput(text) {
  return text
    .split(/[\s,]+/)
    .map(v => v.trim())
    .filter(Boolean);
}

function cartesian(arrays) {
  return arrays.reduce(
    (a, b) => a.flatMap(x => b.map(y => x.concat([y]))),
    [[]]
  );
}

function generate() {
  const template = document.getElementById('template').value;
  const blocks = document.querySelectorAll('.var-block');
  const names = [];
  const values = [];

  blocks.forEach(b => {
    const n = b.querySelector('input').value;
    const v = splitInput(b.querySelector('textarea').value);
    if (n && v.length) {
      names.push(n);
      values.push(v);
    }
  });

  const mode = document.getElementById('mode').value;
  const results = [];

  if (mode === 'cross') {
    cartesian(values).forEach(combo => {
      let cmd = template;
      combo.forEach((val, i) => {
        cmd = cmd.replace(
          new RegExp(`\\$\\{${names[i]}\\}`, 'g'),
          val
        );
      });
      results.push(cmd);
    });
  } else {
    const len = Math.min(...values.map(v => v.length));
    for (let i = 0; i < len; i++) {
      let cmd = template;
      names.forEach((n, idx) => {
        cmd = cmd.replace(
          new RegExp(`\\$\\{${n}\\}`, 'g'),
          values[idx][i]
        );
      });
      results.push(cmd);
    }
  }

  const outputText = results.join('\n');
  document.getElementById('output').textContent = outputText;

  saveVars();
  saveHistory(template, outputText);
}

function copy() {
  navigator.clipboard.writeText(
    document.getElementById('output').textContent
  );
  alert('已複製');
}


/*************************************************
 * Template 套用
 *************************************************/
function applyTemplate() {
  const sel = document.getElementById('templateSelect');
  const opt = sel.options[sel.selectedIndex];

  document.getElementById('template').value = opt.value || '';
  document.getElementById('commandDesc').innerHTML =
    opt.dataset.desc || '未填寫說明';

  const note = document.getElementById('riskNote');
  if (opt.dataset.risk === 'danger') {
    note.innerHTML =
      '<p class="danger">⚠️ 此指令會實際影響線上資源，請確認後再執行</p>';
  } else if (opt.dataset.risk === 'safe') {
    note.innerHTML =
      '<p class="safe">✅ 此指令為只讀操作，不會影響線上</p>';
  } else {
    note.innerHTML = '';
  }

  syncVarsFromTemplate();

  localStorage.setItem(
    'lastTemplateIndex',
    sel.selectedIndex
  );
}


/*************************************************
 * Vars 同步邏輯
 *************************************************/
function loadVarsFromStorage() {
  const raw = JSON.parse(localStorage.getItem('vars') || '[]');
  const map = new Map();

  raw.forEach(v => {
    if (v?.name) {
      map.set(v.name, v.value ?? '');
    }
  });

  return map;
}

function getVarsFromTemplate() {
  const template = document.getElementById('template').value || '';
  const matches = [...template.matchAll(/\$\{(\w+)\}/g)];
  return new Set(matches.map(m => m[1]));
}

function getVarsFromDOM() {
  const map = new Map();

  document.querySelectorAll('.var-block').forEach(b => {
    const name = b.querySelector('input')?.value;
    const value = b.querySelector('textarea')?.value ?? '';
    if (name) map.set(name, value);
  });

  return map;
}

function syncVarsFromTemplate() {
  const storageMap = loadVarsFromStorage();
  const templateSet = getVarsFromTemplate();
  const domMap = getVarsFromDOM();

  const finalMap = new Map();

  storageMap.forEach((value, name) => {
    if (templateSet.has(name)) {
      finalMap.set(name, value);
    }
  });

  templateSet.forEach(name => {
    if (!finalMap.has(name)) {
      finalMap.set(name, '');
    }
  });

  finalMap.forEach((value, name) => {
    if (!domMap.has(name)) {
      addVar(name, value);
    }
  });

  document.querySelectorAll('.var-block').forEach(b => {
    const name = b.querySelector('input')?.value;
    if (name && !finalMap.has(name)) {
      b.remove();
    }
  });
}


/*************************************************
 * Template 選單 / Group
 *************************************************/
function renderTemplateOptions(arr) {
  const select = document.getElementById('templateSelect');
  select.innerHTML = '';

  arr.forEach(item => {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = item.value;
    opt.dataset.risk = item.risk || '';
    if (item.risk==null) {
    opt.disabled = true;
    //給禁用選項
    }
    opt.dataset.desc = item.desc || '未填寫說明';
    select.appendChild(opt);
  });

  const lastIndex = localStorage.getItem('lastTemplateIndex');
  if (lastIndex !== null && select.options[lastIndex]) {
    select.selectedIndex = lastIndex;
    applyTemplate();
  }
}

const groupSelect = document.getElementById('templateGroup');

function renderGroupSelect() {
  groupSelect.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.textContent = '指令集';
  placeholder.disabled = true;
  placeholder.selected = true;
  groupSelect.appendChild(placeholder);

  Object.keys(ALL_TEMPLATE).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key.replace('_TEMPLATE_CONFIG', '');
    groupSelect.appendChild(option);
  });
}

groupSelect.addEventListener('change', e => {
  const groupKey = e.target.value;
  localStorage.setItem('lastGroup', groupKey);

  if (ALL_TEMPLATE[groupKey]) {
    renderTemplateOptions(ALL_TEMPLATE[groupKey]);
    rendersearch = ALL_TEMPLATE[groupKey];
  }
});


/*************************************************
 * 搜尋功能
 * 想加入新功能 可以搜索全部template以及 點擊後等同於點擊applytemple
 *************************************************/
let rendersearch = ALL_TEMPLATE['KUBECTL_TEMPLATE_CONFIG'];
//let rendersearch = ALL_TEMPLATE;


const select = document.getElementById('cmdSelect');
const search = document.getElementById('search');
const textarea = document.getElementById('template');

function render(options) {
  select.innerHTML = '';
  options.forEach((t, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = t.label;
    opt.dataset.command = t.value;
    select.appendChild(opt);
  });
}

search.addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  render(
    rendersearch.filter(t =>
      t.label.toLowerCase().includes(keyword) ||
      (t.desc && t.desc.toLowerCase().includes(keyword))
    )
  );
});

select.addEventListener('change', () => {
  const option = select.selectedOptions[0];
  if (option) textarea.value = option.dataset.command;
});

select.addEventListener('dblclick', () => {
  const option = select.selectedOptions[0];
  if (option) textarea.value = option.dataset.command;
});

searchdis=document.getElementsByClassName('hiden')[0]

searchDisploy.addEventListener('click', () => {
  if (searchdis.className!='t') {
    searchdis.className='t'
  }else{
    searchdis.className='hiden'
  }
  
});


/*************************************************
 * Vars 儲存 / 還原
 *************************************************/
function saveVars() {
  const vars = [];

  document.querySelectorAll('.var-block').forEach(b => {
    const value = b.querySelector('textarea').value;
    if (value !== '') {
      vars.push({
        name: b.querySelector('input').value,
        value
      });
    }
  });

  localStorage.setItem('vars', JSON.stringify(vars));
}

function loadVars() {
  vars.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('vars') || '[]');
  saved.forEach(v => addVar(v.name, v.value));
}


/*************************************************
 * History
 *************************************************/
const HISTORY_KEY = 'command_history';

function nowString() {
  return new Date().toLocaleString('zh-TW', { hour12: false });
}

function saveHistory(template, output) {
  if (!output.trim()) return;

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  history.unshift({
    time: nowString(),
    template,
    output
  });

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, 50))
  );

  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('history');
  container.innerHTML = '';

  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

    history.forEach(item => {
      const div = document.createElement('div');
      div.style.cssText = `
        border:1px solid #ccc;
        padding:6px;
        margin-bottom:6px;
        cursor:pointer;
        background:#fff;
      `;

      div.innerHTML = `
        <div style="font-size:12px;color:#666;">${item.time}</div>
        <div style="font-size:13px;">${item.template}</div>
      `;

      div.addEventListener('click', () => {
        document.getElementById('output').textContent = item.output;
      });

      container.appendChild(div);
    });
  } catch {}
}


/*************************************************
 * 初始化 / 事件
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {
  renderGroupSelect();

  const lastGroup = localStorage.getItem('lastGroup');
  if (lastGroup && ALL_TEMPLATE[lastGroup]) {
    groupSelect.value = lastGroup;
    renderTemplateOptions(ALL_TEMPLATE[lastGroup]);
  } else {
    renderTemplateOptions(ALL_TEMPLATE['KUBECTL_TEMPLATE_CONFIG']);
  }

  loadVars();
  syncVarsFromTemplate();
  renderHistory();
});

document.getElementById('template')
  .addEventListener('input', syncVarsFromTemplate);

document.getElementById('clearVarsBtn')
  .addEventListener('click', () => {
    if (!confirm('確定要清空所有暫存變數嗎？')) return;
    localStorage.removeItem('vars');
    document.getElementById('vars').innerHTML = '';
    syncVarsFromTemplate();
  });

document.getElementById('clearHistoryBtn')
  .addEventListener('click', () => {
    if (!confirm('確定要清空所有歷史紀錄？')) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });

document.getElementById('mode')
  .addEventListener('change', e =>
    localStorage.setItem('mode', e.target.value)
  );

const savedMode = localStorage.getItem('mode');
if (savedMode) {
  document.getElementById('mode').value = savedMode;
}
