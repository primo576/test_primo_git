import pandas as pd
from pathlib import Path

def normalize_domain(domain: str) -> str:
    domain = str(domain).strip().lower()
    if not domain or '.' not in domain:
        return ''
    parts = domain.split('.')
    return '.'.join(parts[-2:])  # a.b.com -> b.com

def main():
    input_file = "data.xls.xlsx"     # 原始檔案
    output_file = "output.xlsx"   # 新檔案（不覆蓋原始）
    

    #targets = input("輸入多個域名（逗號分隔）： ").split(',')
    targets = "0li241l70ai.top,1n4hfxq26ai.top,1x.club,1xbet1.cc,1xbet1.club,1xbet1.me,1xbet1.vip,2026qqpg.com,2k2bet.com,3k2bet.com,456pmbet.cc,456pmbet.com,4f2sfnq50ai.top,777-kk.bet,77global.org,88w03.com,88w06.com,88w07.com,88w08.com,88w09.com,997bet.club,997bet.co,997bet.net,997bet.online,997bet.win,9xn4hfq49ai.top,agnonapg.com,agnonapg.cyou,ak-geishapg.com,ak-minecraftpg.com,ak-pilatespg.com,ak-sardine.com,ak-tiramisupg.com,aliceqqpg.com,amaplay.bet,amaplay.net,aquario777.bet,aswoa05wo.top,athenapg-br.com,athenapg-br.vip,balmoralpg.com,balmoralpg.cyou,belaqqpg.com,blazejon.bet,blazejon.net,bmwpg777.com,br-montblanc.bet,brsambabet.com,ca3-999.xyz,ca4-888.top,ca9uq.vip,casinoup.bet,casinoup.net,coala-ak.com,cocacolasbet.com,cuide-se-ak.com,dj-grupo.com,donaldpg-br.com,donaldpg-br.vip,dragao-777.com,dwph0iq48ai.top,eaglepg-br.com,eaglepg-br.vip,eanonovo.com,elsapg-br.com,elsapg-br.vip,elsaqqpg.com,epifilo777.bet,esmeralda777.bet,fa8-folia777.bet,fa8-folia777.cc,fa8-folia777.com,fa8-folia777.love,fa8-folia777.vip,fa8-lash777.bet,fa8-lash777.cc,fa8-lash777.com,fa8-lash777.love,fa8-lash777.vip,fa8-lip777.bet,fa8-lip777.cc,fa8-lip777.com,fa8-lip777.love,fa8-lip777.vip,fa8-nail777.bet,fa8-nail777.cc,fa8-nail777.com,fa8-nail777.love,fa8-nail777.vip,fa8-teacher777.bet,fa8-teacher777.cc,fa8-teacher777.com,fa8-teacher777.love,fa8-teacher777.vip,fb68vn.bar,fb68vn.biz,fb68vn.blog,fb68vn.cam,fb68vn.casino,fighterpg-br.com,fighterpg-br.vip,figpg-br.com,figpg-br.vip,foco-ak.com,frevojogo.com,gaivota777.bet,giro-br.com,goofypg-br.com,goofypg-br.vip,hadespg-br.com,hadespg-br.vip,herapg-br.com,herapg-br.vip,ht1xbet.xyz,id2026.org,jdb2fvq47ai.top,kappahlpg.com,kappahlpg.cyou,kcmm.bar,kjfty4c88ai.top,kk-disney777.cc,kk-disney777.com,kk-disney777.love,kk-disney777.shop,kk-disney777.vip,kk-kart777.cc,kk-kart777.com,kk-kart777.love,kk-kart777.shop,kk-kart777.vip,kk-lb23.cc,kk-lb23.com,kk-lb23.love,kk-lb23.shop,kk-lb23.vip,kk-play777.cc,kk-play777.com,kk-play777.love,kk-play777.shop,kk-play777.vip,kk-ski777.cc,kk-ski777.com,kk-ski777.love,kk-ski777.shop,kk-ski777.vip,kk-surf777.cc,kk-surf777.com,kk-surf777.love,kk-surf777.shop,kk-surf777.vip,l7-agro777.cc,l7-agro777.com,l7-agro777.top,l7-carnaval777.cc,l7-carnaval777.com,l7-carnaval777.top,l7-cupido777.cc,l7-cupido777.com,l7-cupido777.top,l7-escola777.cc,l7-escola777.com,l7-escola777.top,l7-praia777.cc,l7-praia777.com,l7-praia777.top,l7-zoo777.cc,l7-zoo777.com,l7-zoo777.top,lemonpg-br.com,lemonpg-br.vip,leoroyal.bet,leoroyal.net,limao-777.bet,m8-daimlerpg.com,m8-daimlerpg.cyou,m8-datsunpg.com,m8-datsunpg.cyou,m8-mclarenpg.com,m8-mclarenpg.cyou,m8-seatpg.com,m8-seatpg.cyou,mahjong-ak.com,mambapg-br.com,mambapg-br.vip,mcgg.bar,mickeypg-br.com,mickeypg-br.vip,millionario-ak.com,minionspg-br.com,minionspg-br.vip,missbet1.com,missbet2.com,missbet3.com,missbet4.com,missbet5.com,moanaqqpg.com,model2.vip,motocicleta777.com,mulanqqpg.com,mulheres-ak.com,mzfwvfb60ai.top,n45domain.top,n46domain.xyz,n48domain.xyz,n49domain.xyz,opyyugta2ai.top,otterpg-br.com,otterpg-br.vip,parkerpg.com,parkerpg.cyou,pearpg-br.com,pearpg-br.vip,pg-caribe.com,pg-elsa.com,pg-rosa.bet,pgelf.com,pgelf.games,pgelf.vip,pgelf.win,pgpatim.com,pgpatim.games,pgpatim.vip,pgpatim.win,pgterno.com,pgterno.games,pgterno.vip,pgterno.win,pinfive.bet,pinfive.net,pixclaro.bet,pixclaro.net,poohpg-br.com,poohpg-br.vip,poseidonpg-br.com,poseidonpg-br.vip,qqtgame.com,qwoia04qi.top,rapunzelqqpg.com,rbyq4bb11ai.top,rhino777.bet,rolex-pg.com,rpidn777.art,rpidn777.cc,rpidn777.com,rpidn777.help,rpidn777.org,ru0web.top,ru1web.top,ru918.cc,ru918.com,ru918.net,ru918.org,ru986.com,ryc777.com,schottpg.com,schottpg.cyou,selar777.bet,simbapg-br.com,simbapg-br.vip,so3vtmc70ai.top,sqwia07sqd.top,sucesso-ak.com,summerjogo.com,sundekpg.com,sundekpg.cyou,swanjogo.com,taurus777.bet,test-yq.top,tianaqqpg.com,tiffanyqqpg.com,totemepg.com,totemepg.cyou,uku777.net,va2t.top,valmontpg.com,valmontpg.cyou,we-wg777pg.bet,woodypg-br.com,woodypg-br.vip,xmx777.cc,xmx777.com,xmx777.top,xmx777.vip,xmxkk.com,xxpp.bar,yq-gaming.com,yq.game,yq.games,yq333.top,yq666.com,yq6677.com,yq678.com,yq8899.com,yq999.com,yqadmin888.com,yqcnadmin888.com,yqcncw888.com,yqpkadmin888.com,yuzupg-br.com,yuzupg-br.vip,zebrapg-br.com,zebrapg-br.vip".split(',')
    #targets = "".split(',')

    target_bases = {normalize_domain(t) for t in targets}
    

     #   if not target_base:
     #   print("❌ 域名格式不正確")
     #   return

    # 讀取 Excel（保留原本順序）
    df = pd.read_excel(input_file, engine="openpyxl")

    # 假設 A 欄是 domain
    col_domain = df.columns[0]   # A 欄
    col_mark = "是否在用"         # D 欄名稱（若不存在會自動建立）

    if col_mark not in df.columns:
        df[col_mark] = ""

    #def check_used(x):
    #    base = normalize_domain(x)
    #    return "是" if base == target_base else ""

    df[col_mark] = df[col_domain].apply(
    lambda x: "是" if normalize_domain(x) in target_bases else "否"
    )

    # 輸出新檔案（不改變排序）
    df.to_excel(output_file, index=False, engine="openpyxl")

    print(f"✅ 完成比對，輸出檔案：{output_file}")

if __name__ == "__main__":
    print('檔案要先重新存一次xlsx格式')
    main()
