const config = {
  "version": 1.1,
  "jenkins": {
    "base_url": "https://jenkins.yq-ops.top/"
  },
  "jobs": {
    "deploy": {
      "services": {
        "pod": {
          "desc": "單pod服務",
          "item": [
            "bsibot",
            "pod-admin-prod",
            "pod-bsigame-prod",
            "pod-bsimember-prod",
            "pod-bsitask-prod",
            "pod-cashback-prod",
            "pod-merchant-prod",
            "pod-web-prod"
          ]
        },
        "gocron": {
          "desc": "定時任務",
          "item": "gocron"
        },
        "public": {
          "desc": "公共服務",
          "item": [
            "backend",
            "bsicrontask",
            "bsimerchant-TASK",
            "bsinglegame",
            "bsipull",
            "bsirebate",
            "bsireportcrontask",
            "bsizkt",
            "bsizktapi",
            "ipvalidate"
          ],
          "scope": {
            "countries": [
              "br",
              "ph"
            ],
            "params": null,
            "branch": {
              "type": "choice",
              "source": "jenkins"
            },
            "namespace": {
              "type": "multi",
              "source": "environments"
            }
          }
        }
      }
    }
  },
  "branch_modes": {
    "default": {
      "desc": "依照環境自動選 branch",
      "mapping": {
        "uat": "beta",
        "release": "release"
      }
    },
    "main_all": {
      "desc": "main 分支升級所有環境",
      "branch": "main",
      "apply": "all"
    },
    "custom": {
      "desc": "手動指定 branch",
      "apply": "selected"
    }
  },
  "countries": {
    "BR": {
      "name": "Brazil / 巴西",
      "code": "br",
      "jenkins": {
        "path": "bx-all-server"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "n45"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "br"
          ]
        }
      }
    },
    "VN": {
      "name": "Vietnam / 越南",
      "code": "vn",
      "jenkins": {
        "path": "vn-server-all"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "va2"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "va0"
          ]
        }
      }
    },
    "RU": {
      "name": "Russia / 俄羅斯",
      "code": "ru",
      "jenkins": {
        "path": "ru-all-server"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "ru1"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "ru2"
          ]
        }
      }
    },
    "CN": {
      "name": "China / 中文",
      "code": "cn",
      "jenkins": {
        "path": "cn-all-server"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "ca2",
            "ca4"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "ca0",
            "ca1"
          ]
        }
      }
    },
    "PH": {
      "name": "Philippines / 菲律賓",
      "code": "ph",
      "jenkins": {
        "path": "ph-all-server"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "pb2"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "ph"
          ]
        }
      }
    },
    "TH": {
      "name": "Thailand / 泰國",
      "code": "th",
      "jenkins": {
        "path": "th-server-all"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "ba2"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "ba1"
          ]
        }
      }
    },
    "ID": {
      "name": "Indonesia / 印尼",
      "code": "id",
      "jenkins": {
        "path": "id-all-server"
      },
      "environments": {
        "beta": {
          "type": "uat",
          "label": "預發 / Beta / UAT",
          "namespaces": [
            "ia1"
          ]
        },
        "release": {
          "type": "release",
          "label": "演示 / Release / demo",
          "namespaces": [
            "ia2"
          ]
        }
      }
    },
    "test": {
      "name": "test / 測試",
      "code": "test",
      "jenkins": {
        "path": "test"
      },
      "environments": {
        "main": {
          "type": "main",
          "label": "main",
          "namespaces": [
            "main"
          ]
        }
      }
    }
  }
}