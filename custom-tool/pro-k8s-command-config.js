
    function addVar(name = '', value = '') {
  const div = document.createElement('div');
  div.className = 'var-block';
  div.innerHTML = `
    <label>變數名稱</label>
    <input value="${name}">
    <label>變數值</label>
    <textarea>${value}</textarea>
    <button>❌ 刪除</button>
  `;

  const input = div.querySelector('input');
  const textarea = div.querySelector('textarea');
  const btn = div.querySelector('button');

  // ✅ 監聽變更 → 存 localStorage
  input.addEventListener('input', saveVars);
  textarea.addEventListener('input', saveVars);

  // ✅ 刪除也要存
  btn.addEventListener('click', () => {
    div.remove();
    saveVars();
  });

  document.getElementById('vars').appendChild(div);
}


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
            cmd = cmd.replace(new RegExp(`\\$\\{${names[i]}\\}`, 'g'), val);
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

      document.getElementById('output').textContent = results.join('\n');
      saveVars()
    }

    function copy() {
      navigator.clipboard.writeText(
        document.getElementById('output').textContent
      );
      alert('已複製');
    }

    function applyTemplate() {
      const sel = document.getElementById('templateSelect');
      const opt = sel.options[sel.selectedIndex];

      document.getElementById('template').value = opt.value || '';
      document.getElementById('commandDesc').innerText =
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
      //儲存
      localStorage.setItem(
    'lastTemplateIndex',
    document.getElementById('templateSelect').selectedIndex
    );
  //儲存
    }

  
  //
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

//
  function syncVarsFromTemplate() {
  const varsContainer = document.getElementById('vars');

  // 1️⃣ 來源
  const storageMap = loadVarsFromStorage();
  const templateSet = getVarsFromTemplate();
  const domMap = getVarsFromDOM();

  // 2️⃣ 最終應存在的變數（Map）
  const finalMap = new Map();

  // 👉 storage 優先
  storageMap.forEach((value, name) => {
    if (templateSet.has(name)) {
      finalMap.set(name, value);
    }
  });

  // 👉 template 補缺
  templateSet.forEach(name => {
    if (!finalMap.has(name)) {
      finalMap.set(name, '');
    }
  });

  // 3️⃣ 補「應該有但畫面沒有的」
  finalMap.forEach((value, name) => {
    if (!domMap.has(name)) {
      addVar(name, value);
    }
  });

  // 4️⃣ 刪「畫面有但不該存在的」
  document.querySelectorAll('.var-block').forEach(b => {
    const name = b.querySelector('input')?.value;
    if (name && !finalMap.has(name)) {
      b.remove();
    }
  });

  // 5️⃣ 同步一次 storage（防止殘留）
  //saveVars();
}




    function renderTemplateOptions(arr) {
      const select = document.getElementById('templateSelect');
      select.innerHTML = '';

      arr.forEach(item => {
        const opt = document.createElement('option');
        opt.textContent = item.label;
        opt.value = item.value;
        opt.dataset.risk = item.risk || '';
        opt.dataset.desc = item.desc || '未填寫說明';
        select.appendChild(opt);
      });
      //還原
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
      localStorage.setItem('lastGroup', groupKey);   //儲存
        try {
      if (ALL_TEMPLATE[groupKey]) {
        renderTemplateOptions(ALL_TEMPLATE[groupKey]);
        rendersearch=ALL_TEMPLATE[groupKey]
      }
        } catch {}

    });

    document.addEventListener('DOMContentLoaded', () => {
      renderGroupSelect();
      renderTemplateOptions(ALL_TEMPLATE['KUBECTL_TEMPLATE_CONFIG']);
    });


    //搜索功能
    rendersearch=ALL_TEMPLATE['KUBECTL_TEMPLATE_CONFIG']

 const select = document.getElementById('cmdSelect');
const search = document.getElementById('search');
const textarea = document.getElementById('template');

function render(options) {
  select.innerHTML = '';
  options.forEach((t, index) => {
    const opt = document.createElement('option');
    opt.value = index;              // ⭐ 用 index 對應 TEMPLATE
    opt.textContent = t.label;
    opt.dataset.command = t.value; // ⭐ 真正的指令
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

select.addEventListener('change', e => {
  const option = e.target.selectedOptions[0];
  if (!option) return;

  textarea.value = option.dataset.command;
});

select.addEventListener('dblclick', () => {
  const option = select.selectedOptions[0];
  if (!option) return;
  textarea.value = option.dataset.command;
  
});
    //搜索功能


//render(TEMPLATE_CONFIG);
//儲存
document.addEventListener('DOMContentLoaded', () => {
  const lastGroup = localStorage.getItem('lastGroup');
  if (lastGroup && ALL_TEMPLATE[lastGroup]) {
    groupSelect.value = lastGroup;
    renderTemplateOptions(ALL_TEMPLATE[lastGroup]);
  } else {
    renderTemplateOptions(ALL_TEMPLATE['KUBECTL_TEMPLATE_CONFIG']);
  }
  loadVars();
  syncVarsFromTemplate();
});

document.getElementById('template').addEventListener('input', e => {
  localStorage.setItem('lastTemplateText', e.target.value);
});

const lastText = localStorage.getItem('lastTemplateText');
if (lastText) {
  document.getElementById('template').value = lastText;
}


//記住變數卡牌
function saveVars() {
  const vars = [];
  document.querySelectorAll('.var-block').forEach(b => {
    if (b.querySelector('textarea').value!="") {
          vars.push({
      name: b.querySelector('input').value,
      
      value: b.querySelector('textarea').value
    });
    }

  });
  localStorage.setItem('vars', JSON.stringify(vars));
}

function loadVars() {
  vars.innerHTML=""
  const saved = JSON.parse(localStorage.getItem('vars') || '[]');
  saved.forEach(v => addVar(v.name, v.value));
}


// template 改變時
document.getElementById('template')
  .addEventListener('input', syncVarsFromTemplate);

// 頁面初始化
//syncVars();

//

document.getElementById('clearVarsBtn').addEventListener('click', () => {
  if (!confirm('確定要清空所有暫存變數嗎？此動作無法復原')) return;

  localStorage.removeItem('vars');
  document.getElementById('vars').innerHTML = '';
  //syncVars();
  syncVarsFromTemplate();
});



