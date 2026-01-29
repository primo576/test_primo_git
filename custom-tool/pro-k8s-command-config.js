const TEMPLATE_CONFIG = [
  {
    label: '— 自訂 —',
    value: '',
    risk: null,
    desc: ''
  },  
  {
    label: 'describe deployment（✅安全）',
    value: 'kubectl describe deployment ${deployment} -n ${ns}',
    risk: 'safe'
  },
  {
    label: 'get deploy（✅安全）',
    value: 'kubectl get deploy -n ${ns}',
    risk: 'safe'
  }, 
  {
    label: '取得 Pods（✅安全）',
    value: 'kubectl get pods -n ${ns}',
    risk: 'safe'
  },
  {
    label: '重新部署 rollout restart（⚠️影響線上）',
    value: 'kubectl rollout restart deployment ${deployment} -n ${ns}',
    risk: 'danger',
    desc: '重新啟動 Deployment 的 Pods（不中斷服務，但會重建 Pods）'
  },
  {
    label: '重新部署gocron - rollout restart（⚠️影響線上）',
    value: 'kubectl rollout restart deployment gocron-${ns} -n gocron',
    risk: 'danger'
  },
  {
    label: 'delete pod（⚠️影響線上）',
    value: 'kubectl delete pod ${pod} -n ${ns}',
    risk: 'danger'
  },
  {
    label: 'delete deploy （⚠️影響線上）',
    value: "kubectl delete deployment ${deployment} -n ${ns}",
    risk: 'danger',
    desc: '刪除指定 Deployment（不可回復）'
  },
  {
    label: '回滾上一個成功的版本 （⚠️影響線上）',
    value: 'kubectl rollout undo deploy ${deployment} -n ${ns}',
    risk: 'danger'
  },
  {
    label: '查看ingress yaml （✅安全）',
    value: 'kubectl get ingress ${ingressName} -n ${ns} -o yaml',
    risk: 'safe',
    desc: `查看路由
    ph get ingress gocron -n gocron -o yaml
    br get ingress gocron.com  -n gocron -o yaml
    =>gocron路由建立`
  },

    {
    label: '查看ingress （✅安全）',
    value: 'kubectl get ingress -A',
    risk: 'safe'
  },
   {
    label: 'Ingress backend 區塊（gocron）',
    risk: 'safe',
    value: `- backend:
    service:
      name: gocron-\${ns}
      port:
        number: 80
  path: /\${ns}(/|$)(.*)
  pathType: ImplementationSpecific`
  ,
    desc: `注意：此模板為 Ingress rules 片段
請確認 namespace 與 service 已存在`
  }
];