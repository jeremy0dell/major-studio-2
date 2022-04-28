import * as d3 from 'd3'
import * as C from './constants'
import { randomIntFromInterval, getClosestEl } from './helpers'

// racial data
const racial = [
  { // canarsie
    'Hispanic or Latino': 0.13639855151980687,
    'White alone': 0.04060133874684516,
    'Black or African American alone': 0.7396027652803687,
    'American Indian and Alaska Native alone': 0.0013168001755733568,
    'Asian alone': 0.01580160210688028,
    'Native Hawaiian and Other Pacific Islander alone': 0,
    'Some Other Race alone': 0.012948535059804674,
    'Population of two or more races:': 0.05333040711072095
  },
  { // east 105
    'Hispanic or Latino': 0.18849773440223075,
    'White alone': 0.02098292087835483,
    'Black or African American alone': 0.7201115371209481,
    'American Indian and Alaska Native alone': 0.0025792959219240155,
    'Asian alone': 0.008086441268734751,
    'Native Hawaiian and Other Pacific Islander alone': 0.0001394214011850819,
    'Some Other Race alone': 0.010596026490066225,
    'Population of two or more races:': 0.04900662251655629
  },
  { // new lots
    'Hispanic or Latino': 0.16718832763519045,
    'White alone': 0.013916309529542061,
    'Black or African American alone': 0.7378051716665864,
    'American Indian and Alaska Native alone': 0.0022150527278855876,
    'Asian alone': 0.009534357393942313,
    'Native Hawaiian and Other Pacific Islander alone': 0.0004333798815428324,
    'Some Other Race alone': 0.009004670872056628,
    'Population of two or more races:': 0.05990273029325372
  },
  { // livonia
    'Hispanic or Latino': 0.28773963441818995,
    'White alone': 0.014266607222469906,
    'Black or African American alone': 0.6355773517610344,
    'American Indian and Alaska Native alone': 0.0026749888542131075,
    'Asian alone': 0.009451627284886313,
    'Native Hawaiian and Other Pacific Islander alone': 0.00022291573785109228,
    'Some Other Race alone': 0.007311636201515827,
    'Population of two or more races:': 0.0427552385198395
  },
  { // sutter
    'Hispanic or Latino': 0.3448730629739532,
    'White alone': 0.022043238660449344,
    'Black or African American alone': 0.5774103904667703,
    'American Indian and Alaska Native alone': 0.003626772172766238,
    'Asian alone': 0.011257124016767933,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006594131223211342,
    'Some Other Race alone': 0.006970938721680561,
    'Population of two or more races:': 0.03315905986529132
  },
  { // atlantic
    'Hispanic or Latino': 0.35586739168566917,
    'White alone': 0.06079635151727767,
    'Black or African American alone': 0.5085774425539379,
    'American Indian and Alaska Native alone': 0.0030871776881248904,
    'Asian alone': 0.02343448517803894,
    'Native Hawaiian and Other Pacific Islander alone': 0.0008419575513067883,
    'Some Other Race alone': 0.008419575513067884,
    'Population of two or more races:': 0.03897561831257674
  },
  { // broadway
    'Hispanic or Latino': 0.44970074215944456,
    'White alone': 0.06904476897294709,
    'Black or African American alone': 0.39310509935360305,
    'American Indian and Alaska Native alone': 0.0028728752693320567,
    'Asian alone': 0.03404357194158487,
    'Native Hawaiian and Other Pacific Islander alone': 0.00033516878142207326,
    'Some Other Race alone': 0.011347857313861624,
    'Population of two or more races:': 0.039549916207804646
  },
  { // bushwick
    'Hispanic or Latino': 0.35221785875233375,
    'White alone': 0.12167643082469581,
    'Black or African American alone': 0.43224103521534796,
    'American Indian and Alaska Native alone': 0.0030258160046352928,
    'Asian alone': 0.03676044550312239,
    'Native Hawaiian and Other Pacific Islander alone': 0.00038627438357046286,
    'Some Other Race alone': 0.010815682739972961,
    'Population of two or more races:': 0.04287645657632138
  },
  { // wilson
    'Hispanic or Latino': 0.4802892465593655,
    'White alone': 0.1840914392348962,
    'Black or African American alone': 0.24413342663867507,
    'American Indian and Alaska Native alone': 0.0024259388850011664,
    'Asian alone': 0.039328201539538137,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005131793795194775,
    'Some Other Race alone': 0.011243293678563098,
    'Population of two or more races:': 0.03797527408444133
  },
  { // halsey
    'Hispanic or Latino': 0.5773148342205642,
    'White alone': 0.18543823615710273,
    'Black or African American alone': 0.12189294546673932,
    'American Indian and Alaska Native alone': 0.0012994089784968772,
    'Asian alone': 0.0696231713962359,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005868298612566542,
    'Some Other Race alone': 0.012365343505050929,
    'Population of two or more races:': 0.03147923041455338
  },
  { // myrtle-wyckoff
    'Hispanic or Latino': 0.5973314746589664,
    'White alone': 0.1970526735039331,
    'Black or African American alone': 0.07182448803478376,
    'American Indian and Alaska Native alone': 0.001593149457333466,
    'Asian alone': 0.09409538982375784,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005642404328056026,
    'Some Other Race alone': 0.011284808656112052,
    'Population of two or more races:': 0.02625377543230774
  },
  { // dekalb
    'Hispanic or Latino': 0.5452418357455627,
    'White alone': 0.2779356218872213,
    'Black or African American alone': 0.0391750509743624,
    'American Indian and Alaska Native alone': 0.001905271250459605,
    'Asian alone': 0.09593207875121168,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006350904168198683,
    'Some Other Race alone': 0.010997091954407193,
    'Population of two or more races:': 0.02817795901995521
  },
  { // jefferson
    'Hispanic or Latino': 0.5111758566707253,
    'White alone': 0.3012263002261263,
    'Black or African American alone': 0.05053052704818229,
    'American Indian and Alaska Native alone': 0.0019568620629674726,
    'Asian alone': 0.0927117759610367,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005218298834579927,
    'Some Other Race alone': 0.011915115672290833,
    'Population of two or more races:': 0.029961732475213082
  },
  { // morgan
    'Hispanic or Latino': 0.47300254566566924,
    'White alone': 0.28855343664865346,
    'Black or African American alone': 0.1395650037961681,
    'American Indian and Alaska Native alone': 0.0016077888437318565,
    'Asian alone': 0.0519851726139967,
    'Native Hawaiian and Other Pacific Islander alone': 0.0009378768255102497,
    'Some Other Race alone': 0.008887499441739985,
    'Population of two or more races:': 0.03546067616453039
  },
  { // montrose
    'Hispanic or Latino': 0.44931317001589693,
    'White alone': 0.2200709248766967,
    'Black or African American alone': 0.1711979782333999,
    'American Indian and Alaska Native alone': 0.0013858883952227613,
    'Asian alone': 0.12436310275954836,
    'Native Hawaiian and Other Pacific Islander alone': 0.00044837565727795216,
    'Some Other Race alone': 0.007255533363225044,
    'Population of two or more races:': 0.02596502669873232
  },
  { // grand
    'Hispanic or Latino': 0.25756141034924523,
    'White alone': 0.5421378042666963,
    'Black or African American alone': 0.06489166156074194,
    'American Indian and Alaska Native alone': 0.0012811229321004847,
    'Asian alone': 0.08087784771347407,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005570099704784716,
    'Some Other Race alone': 0.009747674483373252,
    'Population of two or more races:': 0.04294546872389016
  },
  { // graham
    'Hispanic or Latino': 0.19651741293532338,
    'White alone': 0.6278503316749585,
    'Black or African American alone': 0.028555140961857378,
    'American Indian and Alaska Native alone': 0.0012956053067993366,
    'Asian alone': 0.08981135986733002,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006218905472636816,
    'Some Other Race alone': 0.008447346600331675,
    'Population of two or more races:': 0.046900912106135985
  },
  { // lorimer
    'Hispanic or Latino': 0.19385930481050198,
    'White alone': 0.6278948057045662,
    'Black or African American alone': 0.029046186052597147,
    'American Indian and Alaska Native alone': 0.0009158707313881983,
    'Asian alone': 0.0928082341140041,
    'Native Hawaiian and Other Pacific Islander alone': 0.00047974181167953245,
    'Some Other Race alone': 0.007021675607309521,
    'Population of two or more races:': 0.047974181167953246
  },
  { // bedford
    'Hispanic or Latino': 0.2411217510259918,
    'White alone': 0.5804103967168263,
    'Black or African American alone': 0.03127222982216142,
    'American Indian and Alaska Native alone': 0.0007113543091655267,
    'Asian alone': 0.09274965800273598,
    'Native Hawaiian and Other Pacific Islander alone': 0.00030095759233926127,
    'Some Other Race alone': 0.007633378932968536,
    'Population of two or more races:': 0.04580027359781122
  },
  { // 1av
    'Hispanic or Latino': 0.14154597638566963,
    'White alone': 0.6185150039668341,
    'Black or African American alone': 0.041581755674128466,
    'American Indian and Alaska Native alone': 0.0008867041052844453,
    'Asian alone': 0.14378607096744084,
    'Native Hawaiian and Other Pacific Islander alone': 0.0007155857691769208,
    'Some Other Race alone': 0.008182567708414355,
    'Population of two or more races:': 0.044786335423051195
  },
  { // 3av
    'Hispanic or Latino': 0.10085842989489192,
    'White alone': 0.6528883474516248,
    'Black or African American alone': 0.03807689038728504,
    'American Indian and Alaska Native alone': 0.0007082754908349151,
    'Asian alone': 0.15409241578604413,
    'Native Hawaiian and Other Pacific Islander alone': 0.000651613451568122,
    'Some Other Race alone': 0.007791030399184067,
    'Population of two or more races:': 0.044932997138567014
  },
  { // union sq
    'Hispanic or Latino': 0.07740982914996836,
    'White alone': 0.6757364831610772,
    'Black or African American alone': 0.03775574773254588,
    'American Indian and Alaska Native alone': 0.0004921605849680095,
    'Asian alone': 0.1479645644378823,
    'Native Hawaiian and Other Pacific Islander alone': 0.00035154327497714967,
    'Some Other Race alone': 0.008718273219433312,
    'Population of two or more races:': 0.05157139843914786
  },
  { // 6av
    'Hispanic or Latino': 0.0852637051585697,
    'White alone': 0.72243082433135,
    'Black or African American alone': 0.031800589220726705,
    'American Indian and Alaska Native alone': 0.0008087343307723412,
    'Asian alone': 0.0984922881404887,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006643174859915661,
    'Some Other Race alone': 0.009762578707180405,
    'Population of two or more races:': 0.05077696262492057
  },
  { // 8av
    'Hispanic or Latino': 0.12707090788601724,
    'White alone': 0.6889220234150651,
    'Black or African American alone': 0.039374861939474266,
    'American Indian and Alaska Native alone': 0.0008283631544068919,
    'Asian alone': 0.09341175171195051,
    'Native Hawaiian and Other Pacific Islander alone': 0.0009111994698475812,
    'Some Other Race alone': 0.007924674177159266,
    'Population of two or more races:': 0.04155621824607908
  }
]

// income
const income = [
  { // canarsie
    'Less than $10,000': 0.043560294687863516,
    '$10,000 to $14,999': 0.00375106630476929,
    '$15,000 to $24,999': 0.08081620783249321,
    '$25,000 to $34,999': 0.09417720046529662,
    '$35,000 to $49,999': 0.10071112834431951,
    '$50,000 to $74,999': 0.14226328034121752,
    '$75,000 to $99,999': 0.15733501357115162,
    '$100,000 to $149,999': 0.19134044203179526,
    '$150,000 to $199,999': 0.12927297402093835,
    '$200,000 or more': 0.05709887553315239
  },
  { // east 105
    'Less than $10,000': 0.13390234702430845,
    '$10,000 to $14,999': 0.07627158424140823,
    '$15,000 to $24,999': 0.15752598491198658,
    '$25,000 to $34,999': 0.11387217099748531,
    '$35,000 to $49,999': 0.09040779547359598,
    '$50,000 to $74,999': 0.12739228834870076,
    '$75,000 to $99,999': 0.11969635373009221,
    '$100,000 to $149,999': 0.10123994132439228,
    '$150,000 to $199,999': 0.05950104777870914,
    '$200,000 or more': 0.020558466051969822
  },
  { // new lots
    'Less than $10,000': 0.14371315372424723,
    '$10,000 to $14,999': 0.06634822071747587,
    '$15,000 to $24,999': 0.10627071027229504,
    '$25,000 to $34,999': 0.12766863564327904,
    '$35,000 to $49,999': 0.144913989338712,
    '$50,000 to $74,999': 0.1463444748595303,
    '$75,000 to $99,999': 0.09390779426595593,
    '$100,000 to $149,999': 0.10259011669788215,
    '$150,000 to $199,999': 0.044797147385103014,
    '$200,000 or more': 0.022941939201844112
  },
  { // livonia
    'Less than $10,000': 0.24877009528463231,
    '$10,000 to $14,999': 0.11188138284876618,
    '$15,000 to $24,999': 0.08636721231370632,
    '$25,000 to $34,999': 0.08757806010261422,
    '$35,000 to $49,999': 0.11326203273882236,
    '$50,000 to $74,999': 0.1319197410212558,
    '$75,000 to $99,999': 0.07937173222575128,
    '$100,000 to $149,999': 0.07855668214023943,
    '$150,000 to $199,999': 0.03391693134620083,
    '$200,000 or more': 0.027412167114585877
  },
  { // sutter
    'Less than $10,000': 0.327623691921306,
    '$10,000 to $14,999': 0.1217272219896749,
    '$15,000 to $24,999': 0.1232069206083438,
    '$25,000 to $34,999': 0.08369052602204549,
    '$35,000 to $49,999': 0.1065074647690805,
    '$50,000 to $74,999': 0.1048717734058881,
    '$75,000 to $99,999': 0.06021668759592578,
    '$100,000 to $149,999': 0.0450955769499093,
    '$150,000 to $199,999': 0.01339891167852658,
    '$200,000 or more': 0.01331742709641412
  },
  { // atlantic
    'Less than $10,000': 0.1954504267892318,
    '$10,000 to $14,999': 0.05696213613482162,
    '$15,000 to $24,999': 0.1016349310571241,
    '$25,000 to $34,999': 0.10370923615670824,
    '$35,000 to $49,999': 0.12359411249726415,
    '$50,000 to $74,999': 0.16140490260450868,
    '$75,000 to $99,999': 0.11253458087108775,
    '$100,000 to $149,999': 0.07752724885095208,
    '$150,000 to $199,999': 0.04826263952724885,
    '$200,000 or more': 0.01965845918144014
  },
  { // broadway junction
    'Less than $10,000': 0.16035773420479305,
    '$10,000 to $14,999': 0.04101452432824982,
    '$15,000 to $24,999': 0.11620116194625998,
    '$25,000 to $34,999': 0.11647407407407408,
    '$35,000 to $49,999': 0.11004967320261437,
    '$50,000 to $74,999': 0.1667700798838054,
    '$75,000 to $99,999': 0.1149108206245461,
    '$100,000 to $149,999': 0.08720014524328251,
    '$150,000 to $199,999': 0.06292665214233842,
    '$200,000 or more': 0.025188235294117647
  },
  { // bushwick av
    'Less than $10,000': 0.14248553868402025,
    '$10,000 to $14,999': 0.055790853217642815,
    '$15,000 to $24,999': 0.1298058568329718,
    '$25,000 to $34,999': 0.10206326825741141,
    '$35,000 to $49,999': 0.09430639913232104,
    '$50,000 to $74,999': 0.16264045553145337,
    '$75,000 to $99,999': 0.12235195227765727,
    '$100,000 to $149,999': 0.11097180043383949,
    '$150,000 to $199,999': 0.049449385394070865,
    '$200,000 or more': 0.030793564714389012
  },
  { // wilson
    'Less than $10,000': 0.09751956869009584,
    '$10,000 to $14,999': 0.045652289669861554,
    '$15,000 to $24,999': 0.1452458732694356,
    '$25,000 to $34,999': 0.07694036208732695,
    '$35,000 to $49,999': 0.08167425452609159,
    '$50,000 to $74,999': 0.1577948615548456,
    '$75,000 to $99,999': 0.13837406815761447,
    '$100,000 to $149,999': 0.13729219914802981,
    '$150,000 to $199,999': 0.06069821618743344,
    '$200,000 or more': 0.05897058040468584
  },
  { // halsey
    'Less than $10,000': 0.08275827408678599,
    '$10,000 to $14,999': 0.03448982593772983,
    '$15,000 to $24,999': 0.12942277518999754,
    '$25,000 to $34,999': 0.06957023780338317,
    '$35,000 to $49,999': 0.08948063250796764,
    '$50,000 to $74,999': 0.17252488354988965,
    '$75,000 to $99,999': 0.1376137533709242,
    '$100,000 to $149,999': 0.134378401569012,
    '$150,000 to $199,999': 0.09486258886982102,
    '$200,000 or more': 0.055063986271144894
  },
  { // myrtle-wyckoff
    'Less than $10,000': 0.1082089155678016,
    '$10,000 to $14,999': 0.034904644754969495,
    '$15,000 to $24,999': 0.0843667585121039,
    '$25,000 to $34,999': 0.07375939775634717,
    '$35,000 to $49,999': 0.10192983664632947,
    '$50,000 to $74,999': 0.17320911237945286,
    '$75,000 to $99,999': 0.1190704585711474,
    '$100,000 to $149,999': 0.14672377484747096,
    '$150,000 to $199,999': 0.09870045266679786,
    '$200,000 or more': 0.059411434756937616
  },
  { // dekalb
    'Less than $10,000': 0.051694557270511775,
    '$10,000 to $14,999': 0.05259093781027168,
    '$15,000 to $24,999': 0.08684772993952525,
    '$25,000 to $34,999': 0.07410199476487048,
    '$35,000 to $49,999': 0.12482778229082048,
    '$50,000 to $74,999': 0.17241817853596894,
    '$75,000 to $99,999': 0.15443316183771097,
    '$100,000 to $149,999': 0.14237133315281164,
    '$150,000 to $199,999': 0.09328007942955141,
    '$200,000 or more': 0.04830724794656557
  },
  { // jefferson
    'Less than $10,000': 0.06663199715370019,
    '$10,000 to $14,999': 0.04912511859582543,
    '$15,000 to $24,999': 0.06861978178368122,
    '$25,000 to $34,999': 0.08356261859582544,
    '$35,000 to $49,999': 0.11430301233396584,
    '$50,000 to $74,999': 0.1815550284629981,
    '$75,000 to $99,999': 0.1335056925996205,
    '$100,000 to $149,999': 0.1429097485768501,
    '$150,000 to $199,999': 0.10103640891840607,
    '$200,000 or more': 0.05894876660341557
  },
  { // morgan
    'Less than $10,000': 0.10859697861989503,
    '$10,000 to $14,999': 0.09500358468826016,
    '$15,000 to $24,999': 0.09138228139802843,
    '$25,000 to $34,999': 0.09329445653565485,
    '$35,000 to $49,999': 0.08056676481884523,
    '$50,000 to $74,999': 0.13839546792984253,
    '$75,000 to $99,999': 0.10497068237101526,
    '$100,000 to $149,999': 0.13445704775316863,
    '$150,000 to $199,999': 0.0733710152349251,
    '$200,000 or more': 0.07951824350275252
  },
  { // montrose
    'Less than $10,000': 0.13238548367520328,
    '$10,000 to $14,999': 0.13220609297244812,
    '$15,000 to $24,999': 0.11170311931059596,
    '$25,000 to $34,999': 0.13006080835052797,
    '$35,000 to $49,999': 0.09391042602257556,
    '$50,000 to $74,999': 0.1194206821216167,
    '$75,000 to $99,999': 0.09818910061900717,
    '$100,000 to $149,999': 0.08339725694865882,
    '$150,000 to $199,999': 0.049195290690617795,
    '$200,000 or more': 0.049475907270299796
  },
  { // grand
    'Less than $10,000': 0.0914641117245859,
    '$10,000 to $14,999': 0.05325576485872036,
    '$15,000 to $24,999': 0.07049074374797014,
    '$25,000 to $34,999': 0.05473692757388762,
    '$35,000 to $49,999': 0.1023179603767457,
    '$50,000 to $74,999': 0.10155521273140632,
    '$75,000 to $99,999': 0.08378044819746672,
    '$100,000 to $149,999': 0.15293455667424488,
    '$150,000 to $199,999': 0.13007843455667426,
    '$200,000 or more': 0.15999074374797015
  },
  { // graham
    'Less than $10,000': 0.054180527623329006,
    '$10,000 to $14,999': 0.038485863007216375,
    '$15,000 to $24,999': 0.04684845616940732,
    '$25,000 to $34,999': 0.041790015379155325,
    '$35,000 to $49,999': 0.06604613746598842,
    '$50,000 to $74,999': 0.12235514018691589,
    '$75,000 to $99,999': 0.09846587010528805,
    '$100,000 to $149,999': 0.1968313024961552,
    '$150,000 to $199,999': 0.1528944753342009,
    '$200,000 or more': 0.18248326038092988
  },
  { // lorimer
    'Less than $10,000': 0.03335820199571016,
    '$10,000 to $14,999': 0.03169933787186422,
    '$15,000 to $24,999': 0.0526934626503777,
    '$25,000 to $34,999': 0.03973319033852466,
    '$35,000 to $49,999': 0.04038729833069104,
    '$50,000 to $74,999': 0.08804224564021262,
    '$75,000 to $99,999': 0.1007847617271286,
    '$100,000 to $149,999': 0.1708837079175604,
    '$150,000 to $199,999': 0.21194814883894436,
    '$200,000 or more': 0.229671640399142
  },
  { // bedford
    'Less than $10,000': 0.048919269727664215,
    '$10,000 to $14,999': 0.037332140474313096,
    '$15,000 to $24,999': 0.02759531752289683,
    '$25,000 to $34,999': 0.0372405531630982,
    '$35,000 to $49,999': 0.04472408564323406,
    '$50,000 to $74,999': 0.0695553466367441,
    '$75,000 to $99,999': 0.09352653605871294,
    '$100,000 to $149,999': 0.17543209801661913,
    '$150,000 to $199,999': 0.18461563656213986,
    '$200,000 or more': 0.2807364590283254
  },
  { // 1av
    'Less than $10,000': 0.09386683319695079,
    '$10,000 to $14,999': 0.048640983677160944,
    '$15,000 to $24,999': 0.06034493302898489,
    '$25,000 to $34,999': 0.0528924587622206,
    '$35,000 to $49,999': 0.07993923080236014,
    '$50,000 to $74,999': 0.13149071880787286,
    '$75,000 to $99,999': 0.07472242559972436,
    '$100,000 to $149,999': 0.1459832034109996,
    '$150,000 to $199,999': 0.10430350144278393,
    '$200,000 or more': 0.20728106292260645
  },
  { // 3av
    'Less than $10,000': 0.06234523366803024,
    '$10,000 to $14,999': 0.023442481715631593,
    '$15,000 to $24,999': 0.05059377711664807,
    '$25,000 to $34,999': 0.04405590678071154,
    '$35,000 to $49,999': 0.07095946448493864,
    '$50,000 to $74,999': 0.14216827817032357,
    '$75,000 to $99,999': 0.059195611751580515,
    '$100,000 to $149,999': 0.1346959836370398,
    '$150,000 to $199,999': 0.12079378951283005,
    '$200,000 or more': 0.2911245816288583
  },
  { // union sq
    'Less than $10,000': 0.04673953567192001,
    '$10,000 to $14,999': 0.006486019318759533,
    '$15,000 to $24,999': 0.03411404846636163,
    '$25,000 to $34,999': 0.027259701745466873,
    '$35,000 to $49,999': 0.05222945263514659,
    '$50,000 to $74,999': 0.09619903406202338,
    '$75,000 to $99,999': 0.07926249788171497,
    '$100,000 to $149,999': 0.13471250635485513,
    '$150,000 to $199,999': 0.09731520081342146,
    '$200,000 or more': 0.42476021013387555
  },
  { // 6 av
    'Less than $10,000': 0.03598875124590631,
    '$10,000 to $14,999': 0.0071827566566994155,
    '$15,000 to $24,999': 0.02353858749822014,
    '$25,000 to $34,999': 0.02927025487683326,
    '$35,000 to $49,999': 0.03815171579097252,
    '$50,000 to $74,999': 0.0666563434429731,
    '$75,000 to $99,999': 0.07808991883810339,
    '$100,000 to $149,999': 0.16028556172575822,
    '$150,000 to $199,999': 0.1241260145237078,
    '$200,000 or more': 0.43684821301438126
  },
  { // 8 av
    'Less than $10,000': 0.045932530737704924,
    '$10,000 to $14,999': 0.04505292008196722,
    '$15,000 to $24,999': 0.04025763319672132,
    '$25,000 to $34,999': 0.03422920081967213,
    '$35,000 to $49,999': 0.04777079918032787,
    '$50,000 to $74,999': 0.08383857581967213,
    '$75,000 to $99,999': 0.0727501024590164,
    '$100,000 to $149,999': 0.1608611168032787,
    '$150,000 to $199,999': 0.13632064549180328,
    '$200,000 or more': 0.3331393954918033
  }
]

//
const rent = [
  2275,
  2275,
  2200,
  2200,
  2200,
  2200,
  3053,
  3053,
  3053,
  3053
]
// stops
// [0] is name, [1] is fullness, [2] is egress, [3] is racial data, [4] is income data
export const stops = [
  ["Canarsie-Rockaway Pkwy", 0.214797136, 0.5],
  // ["CANARSIE-ROCKAW",	0.814797136, 0.5], // for testing eats
  ["E 105 St", 0.1873508353, 0.3],
  // ["EAST 105 ST",	0.8873508353, 0.5], // for testing egress and stuff
  ["New Lots Av", 0.2410501193, 0.3],
  ["Livonia Av", 0.285202864, 0.3],
  ["Sutter Av", 0.3233890215, 0.3],
  ["Atlantic Av", 0.3257756563, 0.3],
  ["Broadway Junction", 0.3579952267, 0.3],
  ["Bushwick Av-Aberdeen St", 0.3758949881, 0.3],
  ["Wilson Av", 0.4164677804, 0.3],
  ["Halsey St", 0.4427207637, 0.3],
  ["Myrtle-Wyckoff Avs", 0.353699284, 0.3],
  ["DeKalb Av", 0.6420047733, 0.3],
  ["Jefferson St", 0.6992840095, 0.3],
  ["Morgan Av", 0.7267303103, 0.3],
  ["Montrose Av", 0.7840095465, 0.3],
  ["Grand St", 0.8257756563, 0.3],
  ["Graham Av", 0.8245823389, 0.3],
  ["Lorimer St", 0.8544152745, 0.3],
  ["Bedford Av", 0.968973747, 0.4],
  ["1 Av", 0.9701670644, 0.3],
  ["3 Av", 0.9677804296, 0.4],
  ["Union Sq-14 St", 1, 0.6],
  ["6 AV", 0.9128878282, 0.6],
  ["8 AV", 0.838902148, 0.8],
].map((stop, i) => {
  stop[3] = racial[i]
  return stop
}).map((stop, i) => {
  stop[4] = income[i]
  return stop
})

/**
 * enter, update, and exit functions for .join method in TrainChart
 * of shape:
 * data => data
 *   .modifyMethod(...) // append, animate, etc.
 */

// enter
export const enterFn = (enter, chartType) => enter
  .append('circle')
    // .attr('cx', () => getRandEl(C.doorIdxs) * C.squareSize)
    .attr('cx', d => getClosestEl(d.x, C.doorIdxs) * C.squareSize)
    .attr('cy', C.height * C.squareSize + C.squareSize)
    .attr('r', C.squareSize / 3)
    .attr('fill', d => chartTypeInfo[chartType].colors(d[chartType]))
    .attr('opacity', 0)
  .transition()
  .duration(250)
    .attr('opacity', 1)
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 400)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 550)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

// exit
export const exitFn = exit => exit
    // .attr('fill', 'red')
  .transition()
  .duration(600)
  .delay(() => Math.random() * 650)
    .attr('cx', d => getClosestEl(d.x, C.doorIdxs) * C.squareSize)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(600)
  .delay(() => Math.random() * 650)
    .attr('cy', C.height * C.squareSize + C.squareSize)
  .transition()
  .duration(500)
    .attr('opacity', 0)
  .remove()

// update (the nightmare)
export const updateFn = update => update
    // .attr('fill', 'black')
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 400)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

  

// map chart handlers

export const chartSeries = (keys, stack) => {
  const stacked = d3.stack()
    .keys(keys)

  const series = stacked(stack)

  return series
}

// Colors
export const raceColors = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(C.raceKeys)

export const incomeColors = d3.scaleOrdinal(d3.schemePaired)
  .domain(C.incomeKeys)  

export const colors = {
  race: raceColors,
  income: incomeColors
}

export const chartTypeInfo = {
  race: {
    colors: raceColors,
    keys: C.raceKeys,
    
  },
  income: {
    colors: incomeColors,
    keys: C.incomeKeys
  }
}

export const transitionColors = (selection, chartType) => selection
  .transition()
  .duration(1000)
  .attr('fill', (d) => chartTypeInfo[chartType].colors(d[chartType]))
