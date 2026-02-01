




ALL_TEMPLATE={

 KUBECTL_TEMPLATE_CONFIG : [
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ``
  },

  // ======================
  // 1. 總覽 / 快速確認
  // ======================
  {
    label: '==================1. 總覽 / 快速確認===================',
    value: '',
    risk: null,
    desc: ``
  },

  {
    label: 'get all（✅安全｜總覽）',
    value: 'kubectl get all -n ${ns}',
    risk: 'safe',
    desc: `看整體狀態（第一個會打）
一次看 deploy / rs / pod / svc
快速判斷「東西到底有沒有起來」`
  },
  {
    label: 'get deploy（✅安全｜列表）',
    value: 'kubectl get deploy -n ${ns}',
    risk: 'safe'
  },
  {
    label: '取得 Pods（✅安全｜列表）',
    value: 'kubectl get pods -n ${ns}',
    risk: 'safe'
  },
  {
    label: 'Pod 狀態快速總覽（✅安全｜wide）',
    value: 'kubectl get pods -n ${ns} -o wide',
    risk: 'safe',
    desc: `重點看：
NODE / IP
Pod 是否集中在同一台 node（資源風險）`
  },

  // ======================
  // 2. Deployment / Pod 詳細
  // ======================
  {
    label: '==================2. Deployment / Pod 詳細=============',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: 'describe deployment（✅安全｜細節）',
    value: 'kubectl describe deployment ${deployment} -n ${ns}',
    risk: 'safe'
  },
  {
    label: 'Pod 為什麼不是 Running（✅安全｜必查）',
    value: 'kubectl describe pod ${pod} -n ${ns}',
    risk: 'safe',
    desc: `99% 問題在 Events：
- ImagePullBackOff
- CrashLoopBackOff
- Readiness / Liveness probe failed`
  },

  // ======================
  // 3. Log / Crash 排查
  // ======================
  {
    label: '==================3. Log / Crash 排查==================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '即時追 pod log（✅安全）',
    value: 'kubectl logs -f ${pod} -n ${ns}',
    risk: 'safe',
    desc: `即時觀察單一 Pod log`
  },
  {
    label: '看「上一版」log（CrashLoop 神技）',
    value: 'kubectl logs ${pod} -n ${ns} --previous',
    risk: 'safe',
    desc: `Pod 一直重啟時一定要用`
  },

  // ======================
  // 4. Rollout / 發佈狀態
  // ======================
  {
    label: '==================4. Rollout / 發佈狀態=================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '查看 rollout 狀態（✅安全｜CI/CD）',
    value: 'kubectl rollout status deploy ${deployment} -n ${ns}',
    risk: 'safe',
    desc: `卡住通常代表：
- Pod 起不來
- readiness failed`
  },

  // ======================
  // 5. Service / Ingress
  // ======================
  {
    label: '==================5. Service / Ingress==================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '查看 ingress yaml（✅安全）',
    value: 'kubectl get ingress ${ingressName} -n ${ns} -o yaml',
    risk: 'safe',
    desc: `確認路由是否存在
例：
ph get ingress gocron -n gocron -o yaml
br get ingress gocron.com -n gocron -o yaml`
  },
  {
    label: '查看 ingress（✅安全｜全部）',
    value: 'kubectl get ingress -A',
    risk: 'safe'
  },

  // ======================
  // 6. 流程型排障（整套）
  // ======================
  {
    label: '==================6. 流程型排障（整套）=================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '排障標準流程（GPT 建議）',
    value:
      'kubectl get pods -n ${ns}\n' +
      'kubectl describe pod ${pod} -n ${ns}\n' +
      'kubectl logs ${pod} -n ${ns}\n' +
      'kubectl logs ${pod} -n ${ns} --previous\n' +
      'kubectl get svc -n ${ns}\n' +
      'kubectl get endpoints ${svc} -n ${ns}',
    risk: 'safe',
    desc: `服務異常時使用
約 8 成問題可定位`
  },

  // ======================
  // 7. 影響線上（Danger 區）
  // ======================
  {
    label: '==================7. 影響線上（Danger 區）===============',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: '重新部署 rollout restart（⚠️影響線上）',
    value: 'kubectl rollout restart deployment ${deployment} -n ${ns}',
    risk: 'danger',
    desc: '會重建 Pods（通常不中斷，但有風險）'
  },
  {
    label: '重新部署 gocron（⚠️影響線上）',
    value: 'kubectl rollout restart deployment gocron-${ns} -n gocron',
    risk: 'danger'
  },
  {
    label: 'delete pod（⚠️影響線上）',
    value: 'kubectl delete pod ${pod} -n ${ns}',
    risk: 'danger'
  },
  {
    label: '回滾上一版本（⚠️影響線上）',
    value: 'kubectl rollout undo deploy ${deployment} -n ${ns}',
    risk: 'danger'
  },
  {
    label: 'delete deployment（⚠️高風險）',
    value: 'kubectl delete deployment ${deployment} -n ${ns}',
    risk: 'danger',
    desc: '刪除 Deployment（不可逆）'
  },

  // ======================
  // 8. 參考模板
  // ======================
  {
    label: '==================8. 參考模板========================',
    value: '',
    risk: null,
    desc: ``
  },
  {
    label: 'Ingress backend 區塊（gocron 範例）',
    risk: 'safe',
    value: `- backend:
  service:
    name: gocron-\${ns}
    port:
      number: 80
path: /\${ns}(/|$)(.*)
pathType: ImplementationSpecific`,
    desc: `Ingress rules 片段
請確認 namespace / service 存在`
  }
],



SYSTEMCTL_TEMPLATE_CONFIG :[
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ``
  },

  // ======================
  // 1. 服務總覽 / 存在性確認
  // ======================
  {
    label: '列出所有已安裝服務（✅安全｜全部）',
    value: 'systemctl list-unit-files --type=service',
    risk: 'safe',
    desc: `查看系統中「有哪些 service 存在」
包含 enabled / disabled / static / masked`
  },
  {
    label: '列出開機會啟動的服務（✅安全｜enabled）',
    value: 'systemctl list-unit-files --type=service --state=enabled',
    risk: 'safe',
    desc: `確認哪些服務會在開機時自動啟動`
  },
  {
    label: '搜尋特定服務是否存在（✅安全）',
    value: 'systemctl list-unit-files | grep ${service}',
    risk: 'safe',
    desc: `快速確認 service 是否存在`
  },

  // ======================
  // 2. 目前運行狀態
  // ======================
  {
    label: '列出目前運行中的服務（✅安全）',
    value: 'systemctl list-units --type=service',
    risk: 'safe',
    desc: `查看目前 active / failed / activating 的服務`
  },
  {
    label: '只看正在 running 的服務（✅安全）',
    value: 'systemctl list-units --type=service --state=running',
    risk: 'safe'
  },
  {
    label: '查看失敗的服務（❗排障必看）',
    value: 'systemctl --failed',
    risk: 'safe',
    desc: `快速定位啟動失敗的 service`
  },

  // ======================
  // 3. 單一服務詳細狀態（排障核心）
  // ======================
  {
    label: '查看服務狀態（✅安全｜必查）',
    value: 'systemctl status ${service}',
    risk: 'safe',
    desc: `第一個一定會打的指令
重點看：
- Active 狀態
- Main PID
- 最後幾行 log`
  },
  {
    label: '查看 service 定義檔（✅安全）',
    value: 'systemctl cat ${service}',
    risk: 'safe',
    desc: `確認 ExecStart / User / EnvironmentFile`
  },

  // ======================
  // 4. Log / 問題定位
  // ======================
  {
    label: '查看 service 歷史 log（✅安全）',
    value: 'journalctl -u ${service}',
    risk: 'safe'
  },
  {
    label: '查看本次開機的 log（✅安全）',
    value: 'journalctl -u ${service} -b',
    risk: 'safe',
    desc: `排查「重開機後起不來」`
  },
  {
    label: '即時追蹤 service log（✅安全）',
    value: 'journalctl -u ${service} -f',
    risk: 'safe',
    desc: `即時觀察服務輸出`
  },
  {
    label: '只看錯誤等級 log（❗快速掃雷）',
    value: 'journalctl -u ${service} -p err',
    risk: 'safe'
  },

  // ======================
  // 5. 開機 / 啟動問題
  // ======================
  {
    label: '確認是否為開機啟動（✅安全）',
    value: 'systemctl is-enabled ${service}',
    risk: 'safe'
  },
  {
    label: '查看開機啟動耗時（⚠️效能排查）',
    value: 'systemd-analyze blame',
    risk: 'safe',
    desc: `找出拖慢開機的服務`
  },
  {
    label: '查看關鍵啟動鏈（⚠️進階）',
    value: 'systemd-analyze critical-chain',
    risk: 'safe'
  },

  // ======================
  // 6. 影響線上（Danger 區）
  // ======================
  {
    label: '啟動服務（⚠️影響線上）',
    value: 'systemctl start ${service}',
    risk: 'danger'
  },
  {
    label: '重啟服務（⚠️影響線上）',
    value: 'systemctl restart ${service}',
    risk: 'danger',
    desc: `設定變更後常用，會中斷服務`
  },
  {
    label: '重新載入設定（⚠️需支援）',
    value: 'systemctl reload ${service}',
    risk: 'danger',
    desc: `需 service 支援 ExecReload`
  },
  {
    label: '停止服務（⚠️高風險）',
    value: 'systemctl stop ${service}',
    risk: 'danger'
  },
  {
    label: '設定開機自動啟動（⚠️變更系統狀態）',
    value: 'systemctl enable ${service}',
    risk: 'danger'
  },
  {
    label: '取消開機自動啟動（⚠️變更系統狀態）',
    value: 'systemctl disable ${service}',
    risk: 'danger'
  }
],

LINUX_BASIC_TEMPLATE_CONFIG : [
  // ======================
  // 0. 自訂
  // ======================
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ``
  },

  // ======================
  // 1. 檔案 / 目錄（只讀）
  // ======================
  {
    label: '查看目錄本身權限（✅安全｜ls -ld）',
    value: 'ls -ld ${path}',
    risk: 'safe',
    desc: `確認目錄本身的 owner / group / 權限
排查 Permission denied 必用`
  },
  {
    label: '查看檔案清單（✅安全｜人類可讀）',
    value: 'ls -lh ${path}',
    risk: 'safe'
  },
  {
    label: '查看檔案詳細資訊（✅安全｜stat）',
    value: 'stat ${file}',
    risk: 'safe',
    desc: `inode / owner / time 全部看得到`
  },

  // ======================
  // 2. 磁碟 / 空間（高頻）
  // ======================
  {
    label: '查看磁碟使用狀況（✅安全｜df -h）',
    value: 'df -h',
    risk: 'safe',
    desc: `服務異常時第一個檢查
磁碟滿 = 各種怪問題`
  },
  {
    label: '查看目錄大小（✅安全｜du -sh）',
    value: 'du -sh ${path}',
    risk: 'safe'
  },
  {
    label: '找出肥大目錄（✅安全｜排序）',
    value: 'du -sh * | sort -h',
    risk: 'safe',
    desc: `快速找出吃空間的兇手`
  },

  // ======================
  // 3. 程序 / 資源
  // ======================
  {
    label: '查看程序（✅安全｜ps）',
    value: 'ps aux | grep ${keyword}',
    risk: 'safe',
    desc: `確認服務是否真的有跑`
  },
  {
    label: '即時資源監控（✅安全｜top）',
    value: 'top',
    risk: 'safe'
  },
  {
    label: '記憶體使用狀況（✅安全｜free）',
    value: 'free -h',
    risk: 'safe',
    desc: `排查 OOM / 記憶體不足`
  },
  {
    label: '系統負載（✅安全｜uptime）',
    value: 'uptime',
    risk: 'safe',
    desc: `load average 判斷系統壓力`
  },

  // ======================
  // 4. Port / Network
  // ======================
  {
    label: '查看監聽中的 port（✅安全｜ss）',
    value: 'ss -lntp',
    risk: 'safe',
    desc: `查 port 是否被佔用（取代 netstat）`
  },
  {
    label: '查特定 port 被誰佔用（✅安全）',
    value: 'lsof -i :${port}',
    risk: 'safe'
  },

  // ======================
  // 5. Log / 文字查看
  // ======================
  {
    label: '即時追 log（✅安全｜tail）',
    value: 'tail -f ${file}',
    risk: 'safe'
  },
  {
    label: '可回滾追 log（✅安全｜less +F）',
    value: 'less +F ${file}',
    risk: 'safe',
    desc: `比 tail -f 好用，可向上捲`
  },
  {
    label: '搜尋錯誤關鍵字（✅安全｜grep）',
    value: 'grep -R "ERROR" ${path}',
    risk: 'safe'
  },

  // ======================
  // 6. 使用者 / 權限
  // ======================
  {
    label: '查看目前使用者（✅安全）',
    value: 'whoami',
    risk: 'safe'
  },
  {
    label: '查看使用者資訊（✅安全｜id）',
    value: 'id ${user}',
    risk: 'safe',
    desc: `服務權限問題必查`
  },

  // ======================
  // 7. 影響系統（Danger 區）
  // ======================
  {
    label: '刪除檔案（⚠️高風險）',
    value: 'rm ${file}',
    risk: 'danger'
  },
  {
    label: '強制刪除目錄（⚠️極高風險）',
    value: 'rm -rf ${path}',
    risk: 'danger',
    desc: `⚠️ 建議加二次確認`
  },
  {
    label: '修改權限（⚠️影響系統）',
    value: 'chmod ${mode} ${path}',
    risk: 'danger'
  },
  {
    label: '修改擁有者（⚠️影響系統）',
    value: 'chown ${user}:${group} ${path}',
    risk: 'danger'
  },
  {
    label: '強制結束程序（⚠️影響線上）',
    value: 'kill -9 ${pid}',
    risk: 'danger'
  }
]


}
