<!--
// Rogério Fredo Vieira - fredovieira@yahoo.com.br
// 19 Jul 2018 - Versão 2.71
//
//  - Para obter o horário de Greewitch:
//  var n=new Date();
//  alert(n.toUTCString());
//
// Data Registers:
var Core={
  Defined:{
    verbose:false,
    execLimit:20,  // define 20 segundos para processar um Case
    numeral:'0123456789',  // 10 algarismos (base 10)
    integer:'0123456789-',
    hexa:'0123456789ABCDEF',  // Base 16
    abc:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',  // 26 letras
    abcLow:'abcdefghijklmnopqrstuvwxyz',
    humHexa:'0123456789ABCDEFGHJKMNPRSTUVWXYZ',  // Base 32 (ainda legível para humanos)
    abcHexa:'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',  // Base 36
    letter:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',  // 52 letras
    special:'.,-_+@',  // 6 caracteres
    separate:' ;:=(){}[]<>|!?#$%&*"/\\/`',  // 25 caracteres  (\\ é apenas um: "\")
    separator:' ;.,-_+@:=(){}[]<>|!?#$%&*"/\\/`',  // 31 caracteres
    minimum:0.00001,
    maximum:999999999999,
    maxPage:999,
    oneSecond:1000,
    oneMinute:60*1000,
    oneHour:60*60*1000,
    oneDay:24*60*60*1000,
    oneWeek:7*24*60*60*1000,
    maxAccessPerSec:1000,  // número máximo de acessos por segundo (estimado)
    pulseInterval:90*1000,  // em milisegundos
    blinkInterval:4*1000  // em milisegundos
  },
  Config:{},
  Biblio:{},
  Menu:{
    type:0,  // 0 => horizontal em cima  1 => vertical à direita  2 => horizontal embaixo  3 => vertical à esquerda
    deepTop:4,  //px
    deepLeft:4,  //px
    deepHeight:60,  // px
    deepWidth:800,  // px
    deepColor:'#484',
    deepOpacity:75,  // 100% == 100
    deepZindex:51,
    deepDisplay:'block',
    firstTxtColor:'yellow',
    iconTop:2, // from the 'deep'
    iconLeft:2, // from the 'deep'
    iconHeight:60,  // px
    iconWidth:800,  // px
    iconZindex:61,
    iconDisplay:'block',
    list:new Array()  // lista dos menus
  },
  Cripto:{
    maxQtdChar:216,  // máxima quantidade de caracteres diferentes a serem criptografados
    addQtdChar:4,  // 220-maxQtdChar (variação do maior número aleatório a ser gerado)
    qtdCharCabec:4,  // quantidade de caracteres que irão compor o início e o fim do cabeçalho.
    cabecIni:''  // sequência de caracteres que identificarão o início/fim do cabeçalho
  },
  Local:{},
  Data:{},
  Temp:{},
  User:{}
};
var $Def=Core.Defined,$Cnf=Core.Config,$Bib=Core.Biblio,$Men=Core.Menu,$Crpt=Core.Cripto,$Loc=Core.Local,$Dat=Core.Data,$Tmp=Core.Temp,$Usr=Core.User,$Scr=(screen || {});
$Def.words=' '+$Def.letter;  // 53 caracteres
$Def.letHexa=$Def.numeral+$Def.letter;  // super "hexadecimal" (base 62)
$Def.phrase=$Def.numeral+$Def.words;  // 63 caracteres
$Def.spcHexa=$Def.letHexa+'@_,;(){}[]';  // extreme "hexadecimal" (base 72)
//
// Controle de tipagem de variáveis:
var $Type=Object.prototype.toString,$hasProp=Object.prototype.hasOwnProperty;
var $Win=window,$Doc=$Win.document,$Root=$Doc.documentElement,Biblio=new Array();
var $Number=$Def.numeral,$Letter=$Def.abc,$Letters=$Def.letter,$Frase=$Def.words;
var $Hex=$Def.hexa,$DHex=$Def.abcHexa,$QHex=$Def.letHexa,$Separator=' .,;-_+=(){}[]<>|!@#$%&/\\/`';
var $Min=$Def.minimum,$Max=$Def.maximum,$Html,$Head,$Body,$Script;
//
function $isHtmlCollection(a) {return (a && $Type.call(a)=='[object HTMLCollection]')};
function $isArray(a) {return (a && a!='undefined' && $Type.call(a)=='[object Array]')};
function $isFunction(f) {return (f && f!='undefined' && $Type.call(f)=='[object Function]')};
function $notFunction(f){return !$isFunction(f)};
function $isNumber(n) {return (n!='undefined' && $Type.call(n)=='[object Number]')};  // só 'n' captura n==0 (foi retirado!)
function $notNumber(n){return !$isNumber(n)};
function $isString(s) {return (s!='undefined' && $Type.call(s)=='[object String]')};  // só 's' captura s=='' (foi retirado!)
function $notString(s){return !$isString(s)};
function $isObj(o) {return (o && o!='undefined' && $Type.call(o)=='[object Object]')};
function $notObj(o){return !$isObj(o)};
function $isObject(o) {return (o && o!='undefined' && typeof(o)=='object')};
function $notObject(o){return !$isObject(o)};
function $isBoolean(b) {return (b!='undefined' && typeof(b)=='boolean')};
function $notBoolean(b){return !$isBoolean(b)};
function $Defined(o) {return (o!='undefined' && $Type.call(o)!='[object Undefined]')};  // NÃO serve para o = {}
function $Undefined(o){return !$Defined(o)};
function $isNatural(n) {return ($isNumber(n) && n>=0)};
function $notNatural(n){return !$isNatural(n)};
function $isInteger(n) {return ($isNumber(n) && n>=1)};
function $notInteger(n){return !$isInteger(n)};
function $isOption(n) {return ($isNumber(n) && n>=-1)};
function $notOption(n){return !$isOption(n)};
function $hasString(s) {return ($isString(s) && s)};  // (s) == (s!='')
function $hasntString(s){return !$hasString(s)};
// Complementar:
function $notEmpty(s){try{return ($isString(s) && (s||'').replace(eval('/\\s/g'),''))}catch(e){return false}};
function $isEmpty(s) {return !$notEmpty(s)};
function $isElement(o) {return !!(o && $isInteger(o.nodeType))};  // nodeType==1 => Image
function $isMethod(f) {try{return !!(f && f.constructor && f.call && f.apply)}catch(e){return false}};
function $hasMethods(o){for (var key in o) {if ($isMethod(o[key])) return true; } return false};
function $listMethods(o){var names=[]; for (var key in o) {if ($isMethod(o[key])) names.push(key);} return names};
function $isMouseButton(e){return (e ? ($Type.call(e)=='[object MouseEvent]' ? 1 : 0) : 0)};
function $isMouseWheel(e) {return ($Type.call(e)=='[object WheelEvent]' ? 1 :  // Chrome
                                  ($Type.call(e)=='[object MouseScrollEvent]' ? 2 :  // Firefox
                                  (e.type=='mousewheel' ? 3 : 0)) )};  // Opera
function $isPlainObject(o) {
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well:
  if (!$isObj(o) || o.nodeType || o.setInterval)  return false;
  // Not own constructor property must be Object:
  if (o.constructor && !$hasProp.call(o, 'constructor') && !$hasProp.call(o.constructor.prototype, 'isPrototypeOf'))  return false;
  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.  
  var key;
  for (key in o) {};
  return (!$Defined(key) || $hasProp.call(o,key));
};
//
// Remove espaços do início e do fim da string:
String.prototype.trim=function(s) {  // NÃO é "case sensitive"!
  s='['+($hasString(s)?s:'\\s')+']';
  return this.replace(eval('/^'+s+'+/i'),'').replace(eval('/'+s+'+$/i'),'');
};
// Remove os caracteres da string:
String.prototype.remove=function(s) {  // NÃO é "case sensitive"!
  s=($hasString(s)?s:'\\s');
  return this.trim(s).replace(eval('/['+s+']+/gi'),'');
};
// Remove os caracteres do início e do fim, e deixa apenas 1 de cada vez no meio:
String.prototype.ttrim=function(s) {  // NÃO é "case sensitive"!
  s=($hasString(s)?s:'\\s');
  return this.trim(s).replace(eval('/['+s+']+/gi'),(s=='\\s'?' ':s));
};
// Remove os espaços à esquerda / direita:
String.prototype.ltrim=function(s) { return this.replace(eval('/^['+(!$hasString(s)?'\\s':s)+']+/i'),'') };
String.prototype.rtrim=function(s) { return this.replace(eval('/['+(!$hasString(s)?'\\s':s)+']+$/i'),'') };
// Captura o lado esquerdo / direito de um string:
String.prototype.left=function(n) {return ($isInteger(n) ? this.substr(0,n) : '')};
String.prototype.right=function(n){return ($isInteger(n) ? (n<=this.length ? this.substr(this.length-n) : '') : '')};
// Conta quanto caracteres há na string:
String.prototype.count=function(s) {return ($hasString(s) ? this.split(s).length-1 : 0)};
// Retorna a n-ésima palavra de um texto, separadas entre si pelo(s) "sep":
String.prototype.tokout=function(n,sep) {
  var len=this.length;  if (!$isInteger(n) || !len)  return '';
  var pos=0,count=0,start;  if (!$hasString(sep))  sep=$Separator;
  while (pos<len) {
    while (sep.indexOf(this.substr(pos,1))>=0) { if ((++pos)>=this.length) return '' } // passa pelos separadores
    count++;  start=pos;
    while (sep.indexOf(this.substr(pos,1))<0) { if ((++pos)>=this.length)  break }  // procura o final da palavra
    if (count==n)  return this.substr(start,pos-start);  // verifica se a palavra encontrada é a que procuramos!
  }
  return '';
};
// Retorna a n-ésima palavra de um texto, cujos caracteres existam dentro de "only":
String.prototype.tokin=function(n,only) {
  var len=this.length;  if (!$isInteger(n) || !len)  return '';
  var pos=0,count=0,start;  if (!$hasString(only))  only=$Def.letHexa;
  while (pos<len) {
    while (only.indexOf(this.substr(pos,1))<0) { if ((++pos)>=this.length) return '' } // passa pelos caracteres indesejados
    count++;  start=pos;
    while (only.indexOf(this.substr(pos,1))>=0) { if ((++pos)>=this.length) break }  // procura o final da palavra
    if (count==n)  return this.substr(start,pos-start);  // verifica se a palavra encontrada é a que procuramos!
  }
  return '';
};
// Inverte um texto:
String.prototype.reverse=function() { return this.split('').reverse().join('') };
// Captura o primeiro algarismo inteiro, maior ou igual a ZERO:
function $Natural(n,min,max) {
  min=($isNumber(min)?(min<0?0:min>>0):0);
  max=($isNumber(max)?max>>0:$Def.maximum);
  n=Number($String(n).tokin(1,$Def.numeral).ltrim('0'));
  return (n<min?min:(n>max?max:n));
};
// Captura o algarismo inteiro maior ou igual a UM:
function $Integer(n,min,max) { return $Natural(n,($isNumber(min)?(min<1?1:min):1),max) };
// Retorna o n-ésimo número inteiro de um texto:
String.prototype.algarism=function(e) {return this.replace(eval('/[^0123456789'+$String(e)+']/g'),'')};  // retorna String, após remover tudo que NÃO for algarismo
// Retorna o n-ésimo número inteiro de um texto:
String.prototype.onlyNum=function(n) { return this.tokin($Integer(n),$Def.numeral) };  // retorna String, do primeiro algarismo inteiro encontrado
String.prototype.toNatural=function(n) { return Number(this.onlyNum(n).ltrim('0')) };  // retorna um Number
String.prototype.toFloat=function(n) { return Number(this.tokin($Integer(n),$Def.numeral+'.').ltrim('0')) };  // retorna um Double
// Substitui textos do "from" pelo do "to", de dentro do "t":
function $stringArrayReplace(t,from,to) {
  t=$String(t);  if ($isEmpty(t))  return '';
  if (!$isArray(from))  from=from.split('|');
  if (!$isArray(to))  to=to.split('|');  // pode estar vazio
  for (var i=0; i<from.length; i++) {
    if (from[i]=='')  continue;  // o que será trocado NÃO pode estar VAZIO!
    from[i]=from[i].replace(eval('/(\\/)/g'),'\\/');  // Para evitar erro por causa de caracteres do tipo '/' no texto a ser procurado
    t=t.replace(eval('/('+from[i]+')/ig'),$String(to[i])); // Ajusta o conteúdo do texto:
  }
  return t;
};
// Procura caracteres/texto (em direção ao final), a partir de uma determinada posição do String:
String.prototype.indexAt=function(n,s) {
  n=$Natural(n);  if (n>=this.length)  return -1;
  s=$String(s);  if (s=='')  s=' ';  // default
  var pos=this.substr(n).indexOf(s);  // NÃO é "case sensitive"!
  return (pos<0?-1:(n+pos));
};
// Procura caracteres/texto (em direção ao início), a partir de uma determinada posição do String:
String.prototype.indexRev=function(n,s) {
  n=$Natural(n);    s=$String(s).reverse();    if (s=='')  s=' ';  // default
  var pos=this.substr(0,n).reverse().indexOf(s);  // NÃO é "case sensitive"!
  return (pos<0?-1:(n-pos-s.length));
};
// Procura pelo "meio", delimitado por "left" e por "right" (NÃO obrigatórios), e remove do String "txt":
function $textRemove(txt,meio,left,right,sep) {
  sep=$String(sep);  if (sep=='')  sep='|';  // separador de campos
  txt=$String(txt);  if (txt=='')  return '';
  if (!$isArray(meio)) {
    meio=$String(meio);  if (meio=='')  return txt;  // NÃO é possível procurar/remover
    meio=meio.split(sep);
  }
  if (!$isArray(left))  left=((left=$String(left))==''?new Array():left.split(sep));
  if (!$isArray(right))   right=((right=$String(right))==''?new Array():right.split(sep));
  for (var doneLeft,doneRight,start,pos,ini,fim,i=0,qtd=meio.length,l,r,w;i<qtd;i++) {
    w=meio[i].length;  if (w<1)  continue;
    start=0;
    while((pos=txt.indexAt(start,meio[i]))>=0) {
      ini=pos;    fim=pos+w;
      // Procura pelo limitador ESQUERDO, se foi definido:
      doneLeft=true;    left[i]=$String(left[i]);
      if (left[i]!='' && ini) {
        doneLeft=false;
        l=txt.indexRev(pos,left[i]);
        if (l>=0 && l<ini) {
          doneLeft=true;
          ini=l;
        }
      }
      // Procura pelo limitador DIREITO, se foi definido:
      doneRight=true;    right[i]=$String(right[i]);
      if (right[i]!='' && fim<(txt.length-1)) {
        doneRight=false;
        r=txt.indexAt(fim,right[i]);
        if (r>fim) {
          doneRight=true;
          fim=r+right[i].length;
        }
      }
      if (doneLeft && doneRight) {
        txt=txt.substr(0,ini)+txt.substr(fim);  // remove o texto
      } else {
        start=fim;  // continua a procura
      }
    }
  }
  return txt;
};
// Find a value inside the array - by fredovieira@yahoo.com.br
if (!$isFunction(Array.prototype.indexOf)) { // equivalente ao comando IsCallable do ECMAScript 5
  Array.prototype.indexOf=function(v,start) {
    for (var i=$Natural(start),len=this.length;i<len;i++) {
      if (this[i]===v)  return i;
    };
    return -1;
  };
}
// Array Remove - Original version by John Resig (MIT Licensed), modified by fredovieira@yahoo.com.br
Array.prototype.remove=function(from,to) {  // o 'to' também será removido
  from=($isNatural(from) ? from : 0);
  to=($isNatural(to) ? to+1 : this.length);  if (to<=from) to=from+1;
  for (var len=this.length; from<len && to<len; from++,to++)  this[from]=this[to];  // emenda o conteúdo
  for (var len=this.length,i=from; i<len; i++)  this[i]=null;  // limpa o conteúdo
  this.length=from;  // remove itens depois de 'from'
  return this;
};
// Remove todo o conteúdo do Array (tanto índices numéricos quanto alfanuméricos):
Array.prototype.removeAll=function() {  // equivalente a "delete array"
  for(var i in this)  this[i]=null;  // funciona se houver índices alfanuméricos e numéricos!
  return this;
};
// Array remove all itens:
Array.prototype.clear=function() { return this.remove() };
// Swap values inside the array - by fredovieira@yahoo.com.br
Array.prototype.swap=function(a,b) {  // 'a' and 'b' are the line number of the array possition
  if ((!$isNumber(a) && !$isString(a)) || (!$isNumber(b) && !$isString(b)))  return;
  var tmp=this[b];
  this[b]=this[a];
  this[a]=tmp;
  return this;
};
// Makes a copy of the Array - by fredovieira@yahoo.com.br
// É MUUITO mais rápido que clone()!! Mas só funciona com índices numéricos.
// A variável que os recebe, apenas JUNTA os dados, sem apagar os que já tinha!! Para apagar, use copyTo()!
Array.prototype.copy=function() { return this.concat() };
Array.prototype.copyTo=function(a) {
  for(var i in a) {
    if ($Defined(this[i]))  a[i]=this[i];  // funciona se houver índices alfanuméricos e numéricos!
    else  delete a[i];
  }
  return a;
};
Array.prototype.copyFrom=function(a) {
  for(var i in this) {
    if ($Defined(a[i]))  this[i]=a[i];  // funciona se houver índices alfanuméricos e numéricos!
    else  delete this[i];
  }
  return this;
};
// A variável que recebe Array() apenas JUNTA os dados aos já existentes, sem apagar os que já tinha!! Para apagar, use copyTo() ou copyFrom()!
Array.prototype.clone=function() {
  var a=new Array();
  for(var i in this)  a[i]=this[i];  // funciona se houver índices alfanuméricos e numéricos!
  return a;
};
// Try to find 'b' in array:
Array.prototype.contains=function(b) {
  for (var a=this.length-1;a>=0;a--) {
    if (this[a]===b)  return true;  // '===' => se é igual e do mesmo tipo
  }
  return false;
};
// Search the string 'a' in the text of each line, and change to the string 'b' of the Array:
Array.prototype.replace=function(a,b,c) {  // c ==> case sensitive (1 == true / 0 == false)
  for (var z=this.length-1;z>=0;z--) this[z]=$String(this[z]).replace(eval('/('+a+')+/g'+($Natural(c)>0?'':'i')),b);
  return this;
};
Array.prototype.sortNumber=function(dir){  // 0 -> crescente;  1 -> decrescente
  if (!$Natural(dir)) this.sort(function(a,b){return a-b});
  else  this.sort(function(a,b){return b-a});
  return this;
};
// Apaga valores duplicados (e inválidos) e ordena a lista para criar uma espécie de Primary Key:
Array.prototype.primaryNum=function(max) {
  max=($isNumber(max)?max>>0:$Def.maximum);  if (max<2) max=$Def.maximum;
  for (var a=this.length-1;a>=0;a--) {
    this[a]=$Natural(this[a]);  if (this[a]<1 || this[a]>max)  this.remove(a,a);  // remove vazios e assegura só números!
  }
  this.sortNumber();  // ordena
  for (var a=this.length-1;a>0;a--) {
    if (this[a]==this[a-1])  this.remove(a,a);  // '==' => se igual ao anterior, remove o valor
  }
  return this;
};
// Formata o número para uma largura fixa 'b':
Number.prototype.toLength=function(b) {
  var a=this.toString(),w=$Natural(b);  // transforma este número em STRING
  while(a.length<w)  a='0'+a;
  return a;
};
// Arredonda o valor de um número:
Number.prototype.round=function(f) {
  f=Math.pow(10, $Natural(f));
  return Math.round(this*f)/f;
};
// Para ordenar os caracteres de um texto:
function $sortWithoutCase(a,b) { return (a.toUpperCase()>b.toUpperCase()) };
function $sortText(t) { return $String(t).split('').sort($sortWithoutCase).join('') };
function $removeRepeated(t) {
  var r='';
  while (t.length>0) {
    if ($Def.letter.indexOf(t[0])>=0)  r+=''+t[0];
    t=t.replace(eval('/['+($hasString(t[0])?t[0]:'\\s')+']+/g'),'');
  }
  return r;
};
// Converte o parâmetro recebido para texto:
function $Str(t,ch) { return ($isNumber(t)?''+t:($isString(t)?t:($isArray(t)?t.join(ch):($isBoolean(t)?(t?'1':'0'):'')))) };
function $String(t) { return $Str(t,';') };
function $String2(t) { return $Str(t,'&') };
// Concatena uma string com outra:
String.prototype.concat=function(s) {return this+$String(s)};
String.prototype.concatLeft=function(s) {return $String(s)+this};
// Usado para retornar a lista de comandos empilhados:
function $stack() {
  var rsp=new Array(),a=$stack;
  for (var c=0; (a=a.caller); c++)  rsp.push((c?c+':':'(caller)')+($notEmpty(a.name) ? a.name : '[anônima]'));
  return rsp.reverse().join("\n");
};
// Função para retornar o primeiro elemento do Array que estiver vazio:
function $freeFromArray(a) {
  var pos=0;  if (!$isArray(a)) return -1;
  for (var len=a.length; pos<len; pos++) { if (!a[pos]) return pos; }
  return pos;
};
// Para fazer troca de valores entre variáveis do tipo String e/ou Number:
function $swap(a,b) {  // Exemplo: $swap('a','b');   ==> porque variáveis tipo 'String' e 'Number' são passadas por valor!
  var tmp=this[b];
  this[b]=this[a]
  return this[a]=tmp;
};
// Retorna o menor de dois valores:
function $min(a,b) { return (a<b?a:b) };
function $max(a,b) { return (a>b?a:b) };
// Para carregar bilbiotecas/imagens:
function $addHead(o) { $Head.appendChild(o) };
function $loadJS(u) {
  if ($isEmpty(u=$String(u)))  return;
  var js=$Doc.createElement('script');
  js.type='text/javascript';
  js.charset='UTF-8';
  js.src=u;
  $addHead(js);
};
function $loadCSS(u) {
  if ($isEmpty(u=$String(u)))  return;
  var lk=$Doc.createElement('link');
  lk.type='text/css';
  lk.rel='stylesheet';
  lk.charset='UTF-8';
  lk.href=u;
  $addHead(lk);
};
// Verifica a existência de atributos, de forma recursiva:
function $isAttrib(o) {  // repassar 'o' como 'String'
  o=$String(o).split('.');
  for (var a=$Win,i=0;i<o.length;++i) if (!(a=a[o[i]])) return false;
  return true;
};
// Cria atributos de forma recursiva (Ex: 'window.a.link.cloud'):
function $attrib(o) {  // repassar 'o' como 'String'
  o=$String(o).split('.');
  for (var a=$Win,i=0;i<o.length;++i) a=a[o[i]]||(a[o[i]]={});
  return a;
};
//
// Cria a função que procura um objeto pelo nome(id):
$Cnf.getIdType=-1;
var cmdGet='if($isObject(o)) return o;';
if ($Doc.getElementById) {
  $Cnf.getIdType=1;
  cmdGet+='if($hasString(o)) return $Doc.getElementById(o);';  // DOM
} else if ($Doc.all) {
  $Cnf.getIdType=2;
  cmdGet+='if($hasString(o)) return $Doc.all[o];';  // IE
} else if ($Doc.layers) {
  $Cnf.getIdType=3;
  cmdGet+='if($hasString(o)) return $Doc.layers[o];';  // Netscape < 6
} else if (navigator.userAgent.toLowerCase().indexOf('safari')>=0) {
  $Cnf.getIdType=4;
  cmdGet+='if($hasString(o)) return $Win.document[o];';
} else {
  cmdGet='alert("$get: Este navegador não tem suporte ao sistema!");'+cmdGet;
}
var $get=Function('o',cmdGet);
//
// Implementa os métodos $getByClass e $getByTag:
$Cnf.getClassType=$Cnf.getTagType=-1;
var cmdClass,cmdTag,cmdCss,cmdCssSty;
if ($Doc.getElementsByTagName) {
  $Cnf.getClassType=$Cnf.getTagType=1;
  cmdClass='var tags=new Array(),allTags=$Doc.getElementsByTagName("*");o=$String(o).trim().toUpperCase();if($isEmpty(o)||o=="*") return allTags;';
  cmdTag=cmdClass+='for(var i=0,len=allTags.length;i<len;i++){';
  cmdTag+='if($String(allTags[i].tagName).toUpperCase()==o) tags.push(allTags[i]);} return tags;';
  cmdClass+='if($String(allTags[i].className).toUpperCase()==o) tags.push(allTags[i]);} return tags;';
} else {
  cmdTag='alert("$getTag: Este navegador não tem suporte ao sistema!");';
  cmdClass='alert("$getClass: Este navegador não tem suporte ao sistema!");';
}
var $getByTag=Function('o',cmdTag),$getByClass=Function('o',cmdClass);
// Cria a função que para acessar os atributos CSS de um objeto, retornando um ponteiro para a função:
var cmdSty='if($isObject(o=$get(o))) return o'+($Cnf.getIdType==3 ? '' : '.style')+';';
var $style=Function('o',cmdSty);
// Cria função para retornar definição CSS:
if ($Doc.querySelector) {
  cmdCss='return $Doc.querySelector(s)';
  cmdCssSty='return $style($css(s));';
} else {
  cmdCss='';
  cmdCssSty='';
}
var $css=Function('s',cmdCss);  // ** IPC (captura as definições CSS criadas na tag <style>) ...
var $cssStyle=Function('s',cmdCssSty);  // ... e os ESTILOS ** !!
// Caminho para a raiz do sistema:
var $pathToRoot='../../',$biblio=$pathToRoot+'global/';
// Repete uma sequência, quantas vezes foram solicitadas:
function $repeat(ch,qtd) {
  if ($isEmpty(ch=$String(ch)) || !$isInteger(qtd)) return '';
  var r='';
  for (var i=0;i<qtd;i++) r+=ch;
  return r;
};
// Função para tratamento de erro:
function $showError(m,u,l) {  // parâmetros que serão informados pelo erro:  msg, url, line
  var txt,a=$showError.arguments,hr=$repeat('-',40);  // hr -> horizontal row
  txt ="Ocorreu um erro no JavaScript !\n"+hr+"\n";
  txt+='Função que falhou: '+$stack().join('<==')+"\n";
  if (m)  txt+='Msg: '+($isString(m)?m:($isString(m.message)?m.message:'??'))+"\n";
  if (u)  txt+='URL: '+($isString(u)?u:'??')+"\n";
  if (l)  txt+='Line: '+(($isNumber(l)||$isString(l))?l:'??')+"\n"+hr+"\n";
  if (a[0])  txt+='Descrição do erro: '+a[0]+"\n";
  if (a[1])  txt+='Arquivo: '+a[1]+"\n";
  if (a[2])  txt+='Número da linha: '+(a[2]-1)+"\n";
  alert(txt+hr);  // exibe a mensagem de erro
  return false;
};
// Tratamento de erro:
function $alert_error() {  // parâmetros que serão informados pelo erro:  msg, url, line
  alert("Use o $showError:\n"+$alert_error.arguments.join("\n"));
  return false;
};
// Muda a transparência do objeto:
function $changeOpac(o,opacity) {
  if (!$isObject(o=$style(o))) return;
  if (!$isNatural(opacity) || (opacity>100))  opacity=50;
  o.opacity=(opacity/100);
  o.MozOpacity=(opacity/100);  // Firefox
  o.KhtmlOpacity=(opacity/100);
  o.filter='alpha(opacity='+opacity+')';
  if (o.filters)  o.filters.alpha.opacity=opacity;
};
//
// Para procurar um parâmetro (Case Sensitive) e retornar seu valor:
function $getParam(t,p,sep,atr) {
  if ($isEmpty(sep))  sep='&';  // separador de parâmetros
  if ($isEmpty(atr))  atr='=';  // atribuidor de valor
  t=$Str(t,sep);    p=$Str(p,sep);    if ($isEmpty(t) || $isEmpty(p))  return '';
  var pos=(t=(sep+t)).indexOf(sep+p+atr);  if (pos<0) return '';  // não achou o parâmetro
  var ini=(pos+sep.length+p.length+atr.length),fim=t.indexOf(sep,ini);  if (fim<1)  fim=t.length;
  return unescape(t.substr(ini,fim-ini));
};
function $setParam(t,p,v,sep,atr) {
  if ($isEmpty(sep))  sep='&';  // separador de parâmetros
  if ($isEmpty(atr))  atr='=';  // atribuidor de valor
  t=$Str(t,sep);    v=$String(v);    if ($isEmpty(p=$Str(p,sep)))  return t;  // nenhum dado em "p"!
  var pos=(t=(sep+t)).indexOf(sep+p+atr);
  if (pos<0) {
    if (t.right(sep.length)!=sep) t+=sep;
    t+=p+atr+v;  // acrescenta o valor da chave
  } else {
    var ini=pos+sep.length+p.length+atr.length,fim=t.length+1;
    pos=t.indexOf(sep,ini);  if (pos>0)  fim=pos;
    t=t.left(ini)+v+t.substring(fim);  // troca o valor velho da chave pelo novo
  }
  while (t.left(sep.length)==sep)   t=t.substring(sep.length);  // remove separadores do começo
  return t;
};
function $paramMix(t,novo,sep,atr) {
  if ($isEmpty(sep))  sep='&';  // separador de parâmetros
  if ($isEmpty(atr))  atr='=';  // atribuidor de valor
  t=$Str(t,sep);    if ($isEmpty(novo=$Str(novo,sep)))  return t;  // nenhum dado em "novo"!
  novo=novo.split(sep);  // separa os dados recebidos, separados pelo SEPARADOR informado
  for (var i=0,l=novo.length,p,pos,v;i<l;i++)  {
    pos=novo[i].indexOf(atr);  if (pos<0)  continue;  // é uma "sujeira" nos dados (pois não possui atribuidor '=')
    p=novo[i].substring(0,pos).trim();  if ($isEmpty(p))  continue;  // se ocorrer, é uma "sujeira" no meio dos dados
    v=novo[i].substring(pos+1);  // captura o valor da chave
    t=$setParam(t,p,v,sep,atr);
  }
  return t;  // nenhuma chave detectada para a posição informada!!
};
function $unsetParam(t,p,sep,atr) {
  if ($isEmpty(sep))  sep='&';  // separador de parâmetros
  if ($isEmpty(atr))  atr='=';  // atribuidor de valor
  t=$Str(t,sep);    p=$Str(p,sep);    if ($isEmpty(p))  return t;
  var pos=(t=(sep+t)).indexOf(sep+p+atr);  if (pos<0)  return t;
  var ini=pos+sep.length+p.length+atr.length,fim=t.length+1,p=t.indexOf(sep,ini);  if (p>0)  fim=p;
  t=t.left(pos)+t.substring(fim);  // remove a chave (e seu valor)
  while (t.left(sep.length)==sep)   t=t.substring(sep.length);  // remove separadores do começo
  return t;
};
//
// Filtro para capturar somente determinadas colunas dos dados repassados:
function $filter(list, fields, sepCol, sepRow) {
  var pos,linha,resp='',ini=0,nr;
  fields=' '+fields.replace(eval('/[,;]/g'),' ').trim()+' ';  // VIXE !! RegEx é danado!!
  if ($isEmpty(fields))  return;
  if (!$hasString(sepCol))  sepCol='|';
  if (!$hasString(sepRow))  sepRow='^';
  while (ini<list.length) {  // para capturar o TIPO da chave:
    nr=0;
    pos=list.indexOf(sepCol,ini);  if (pos<0) pos=list.length;
    linha=list.indexOf(sepRow,pos);  if (linha<0) linha=list.length;
    while (pos>0) {
      // Procura somente os campos definidos em 'fields':
      if (pos>linha)  pos=linha;
      if (pos==ini)  break;   // tamanho ZERO
      // Verifica se o campo é desejado:
      if (fields.indexOf(' '+(++nr)+' ')>=0) {
        if (resp.length>=sepCol.length) {
          if (resp.substr(resp.length-sepCol.length,sepCol.length)!=sepCol   &&
              resp.substr(resp.length-sepRow.length,sepRow.length)!=sepRow)    resp=resp+sepCol;
        }
        resp=resp+list.substr(ini,pos-ini);  if (pos==linha) break;
      }
      // Verifica se está no final da linha:
      if (pos==linha) {
        ini=pos+sepRow.length;
        break;
      }
      // Está na mesma linha, e procura pela próxima coluna:
      ini=pos+sepCol.length;
      pos=list.indexOf('|',ini);
    }
    // Aqui, há mudança de linha:
    if (resp.length>0) {
      if (resp.substr(resp.length-sepRow.length,sepRow.length)!=sepRow)  resp=resp+sepRow;
    }
    if (ini==pos)  ini=pos+sepCol.length;
  }
  return resp;
};
// Captura o número de um texto (Ex: "teste . - 198,323.7 456 cortex" retorna "-198323.7"):
function $Num(n,f,zero) {  // f => divisor da fração
  n=$String(n).replace(eval('/[^ 0123456789.,-]/g'),'').trim(',.').trim();
  zero=$String(zero).trim();  if ($isEmpty(n) || n=='-')  return ((zero==''||zero<1)?'':'0');
  if ($isEmpty(f) || (f!=','))  f='.';  // define o caracter que marca o fracionário => PADRÃO é '.'
  var sign=((n.indexOf('-') || n=='-')?'':'-');  // verifica se é negativo
  n=n.replace(eval('/['+(f=='.'?',':'.')+']/g'),'').tokin(1,$Def.numeral+f).ltrim('0');
  if ($isEmpty(n) || n.left(1)==f)  n='0'+n;
  return sign+n;
};
// Captura um algarismo INTEIRO:
function $Integers(n) { return Number($Num(n))>>0 };
// Verifica se um número é par:
function $isEven(n){
  n=$Integers(n);  if (isFinite(n)) return !(n % 2);
  return false;
};
// Para rotacionar um objeto:
function $rotate(o,v) {
  if (!$isObject(o=$style(o)) || !$isNatural(v)) return;
  o.webkitTransform='rotate('+v+'deg)';  // Safari and Chrome
  o.msTransform='rotate('+v+'deg)';  // IE 9
  o.MozTransform='rotate('+v+'deg)';  // Firefox
  o.OTransform='rotate('+v+'deg)';  // Opera
  o.transform='rotate('+v+'deg)';  // CSS3
};
// Lê o valor(texto) de um objeto:
function $getTxt(o) {
  o=$get(o);
  try { return (o.text || o.textContent || o.innerText || o.innerHTML || '') } catch(e) {return ''}
};
function $setTxt(o,v) {
  v=$String(v);  if (!$isObject(o=$get(o))) return;
  try {
    if (o.text) {o.text=v; return;}
    if (o.textContent) {o.textContent=v; return;}
    if (o.innerText) {o.innerText=v; return;}
    if (o.innerHTML) {o.innerHTML=v; return;}
    if (o.value)  o.value=v;
  }catch(e){}
};
// Lê o valor(texto) de um objeto:
function $getVal(o) { try { return ($get(o).value || '') } catch(e) {} return '' };
function $setVal(o,v) { try {$get(o).value=v} catch(e) {} };
// Para generalizar a atribuição:
function $tagType(o) {
  o=$get(o);  if (!o)  return '';
  var type=$String(o.type);  if ($isEmpty(type))  type=$String(o.tagName);
  if ($isEmpty(type))  type='NONE';
  return type.toUpperCase();
};
function $setValue(o,v) {
  o=$get(o);  if (!o)  return;
  var tag=$tagType(o);  if (tag=='SPAN' || tag=='TD')  return $setHtml(o,v);
  $setVal(o,v);
};
function $isEditable(o) {
  o=$get(o);  if (!o)  return false;
  var tag=$tagType(o),enabled=$String(o.disabled?false:true);
  return (enabled && (tag=='TEXT' || tag=='TEXTAREA'));
};
function $setValArray(l,v) {
  if ($isString(l))  l=l.split(',');
  v=$String(v);  if (!$isArray(l))  return;
  for (var i=0,len=l.length; i<len; i++)  $setVal(l[i],v);
};
// Remove os pontos de um número e atualiza o conteúdo do <INPUT>:
function $removerPontos(o) { $setVal(o,$getVal(o).remove(' .').ltrim('0')) };
// Lê o valor(texto) de um objeto:
function $getContent(o) { try { return ($get(o).content || '') } catch(e) {} return '' };
function $setContent(o,v) { try {$get(o).content=v} catch(e) {} };
// Lê o valor(texto) de um objeto:
function $getMeta(o) {
  try {
    var o=$get(o),id=$String(o.id),v=(o.content || '');  if ($isEmpty(v)) return '';
    return ($isEmpty(id) ? '' : id+'=')+v;
  } catch(e) {}
  return '';
};
function $setMeta(o,v) { try {$get(o).content=v} catch(e) {} };
// Para capturar o valor do HTML:
function $getHtml(o) {
  o=$get(o);
  try { return (o.innerHTML || o.innerText || o.textContent || o.text || '') } catch(e) {return ''}
};
function $getValue(o) {
  o=$get(o);  if (!o)  return;
  var tag=$tagType(o);  if (tag=='SPAN' || tag=='TD')  return $getHtml(o);
  return $getVal(o);
};
//
$Cnf.htmlType=0;
function $typeOfHtml(type) {
  if ($isInteger(type)) {
    if (!$Cnf.htmlType || type<$Cnf.htmlType)  $Cnf.htmlType=type;  // armazena a menor ocorrência
  }
  return $Cnf.htmlType;
};
function $setHtml(o,v) {
  v=$String(v);  if (!$isObject(o=$get(o))) return -1;
  try {o.innerHTML=v;return $typeOfHtml(1);}catch(e){};
  try {o.innerText=v;return $typeOfHtml(2);}catch(e){};
  try {o.textContent=v;return $typeOfHtml(3);}catch(e){};
  try {o.text=v;return $typeOfHtml(4);}catch(e){};
  try {o.value=v;return $typeOfHtml(5);}catch(e){};
  return -2;
};
// Atribui valores para os <SPAN>:
function $setHtmlArray(l,v) {
  if ($isString(l))  l=l.split(',');
  v=$String(v);  if (!$isArray(l))  return;
  for (var i=0,len=l.length; i<len; i++)  $setHtml(l[i],v);
};
// Retorna o valor de um objeto:
function $g(o) {
  if (!$isObject(o=$get(o))) return '';
  try { return (o.value || o.innerHTML || o.text || o.innerText || o.textContent || '') } catch(e) {return ''}
};
// Atribui valor a um objeto:
function $s(o,v) {
  v=$String(v);  if (!$isObject(o=$get(o))) return;
  try {
    $setVal(o,v);
    $setHtml(o,v);
    if (o.text)  o.text=v;
    if (o.innerText)  o.innerText=v;
    if (o.textContent)  o.textContent=v;
  }catch(e){}
};
//
// Para verificar se é uma opção ( <SELECT ID="nome">...</SELECT> ):
function $isSelectTag(o) {
  if (!(o=$get(o))) return false;
  return ($isObject(o) && $isString(o.type) && o.type.toUpperCase()=='SELECT-ONE' && $isOption(o.selectedIndex));
};
// Para capturar o índice de uma opção selecionada ( <SELECT ID="nome">...</SELECT> ):
function $getSelIndex(o) {
  if (!$isSelectTag(o=$get(o))) return -2;
  return o.selectedIndex;
};
// Para atribuir/alterar o valor de uma opção ( <SELECT ID="nome">...</SELECT> ):
function $getSelVal(o,pos) {  // pos => é a posição do valor que deve ser retornado
  if (!$isSelectTag(o=$get(o)))  return '';
  pos=($isNatural(pos) ? pos : o.selectedIndex);
  return (pos<0 ? '' : o.options[pos].value);
};
// Captura o índice da opção pelo valor intrínsico:
function $getSelByVal(o,v) {
  v=$String(v).toUpperCase();  if (!$isSelectTag(o=$get(o))) return -2;
  for (var i=0,len=o.length; i<len; i++) { if ($getSelVal(o,i).toUpperCase()==v)  return i }
  return -1;
};
// Captura o texto da seleção:
function $getSelTxt(o,pos) {
  if (!$isSelectTag(o=$get(o)))  return '';
  pos=($isNatural(pos) ? pos : o.selectedIndex);
  return (pos<0 ? '' : o.options[pos].text);
};
// Captura o índice da opção pelo texto exibido:
function $getSelByTxt(o,t) {
  t=$String(t).toUpperCase();  if (!$isSelectTag(o=$get(o))) return -2;
  for (var i=0,len=o.length; i<len; i++) { if ($getSelTxt(o,i).toUpperCase()==t)  return i }
  return -1;
};
// Para selecionar uma opção pelo número do índice ( <SELECT ID="nome">...</SELECT> ):
function $setSelIndex(o,pos) {
  if (!$isSelectTag(o=$get(o)))  return -3;
  return ($isOption(pos) ? o.selectedIndex=pos : -2);
};
function $setSelNone(o) { $setSelIndex(o,-1) };  // desmarcar
function $setSelVal(o,pos,v) { if ($isSelectTag(o=$get(o)) || $isOption(pos))  o.options[pos].value=$String(v) };
// Para retornar a <OPTION> atualmente selecionada (ou indicada):
function $getSelOption(o,pos) {  // pos => é a posição do valor que deve ser retornado
  if (!$isSelectTag(o=$get(o)))  return;
  pos=($isNatural(pos) ? pos : o.selectedIndex);  if (pos<0) return;
  return o.options[pos];
};
// Para atribuir/alterar o valor do texto visualizado uma opção ( <SELECT ID="nome">...</SELECT> ):
function $setSelTxt(o,pos,t) { if ($isSelectTag(o=$get(o)) || $isOption(pos))  o.options[pos].text=$String(t) };
// Retorna um texto pelo código intrínsico da opção:
function $getSelTxtByVal(o,v) {
  var pos=$String(v).algarism();  if (!(o=$get(o)))  return '';
  return $getSelTxt(o,$getSelByVal(o,pos));
};
// Para esvaziar o conteúdo de uma <SELECT  ... OPTION ...>
// Deixa apenas uma linha em branco.
function $esvaziar(o) {
  if (!$isSelectTag(o=$get(o)) || !$isFunction(o.remove))  return;
  while (o.length>1)  o.remove(o.length-1);  // apaga do último para o primeiro
  $setSelVal(o,0,0);  // primeira linha sem valor
  $setSelTxt(o,0,'');  // primeira linha em branco
};
// Seleciona uma opção pelo texto visualizado:
function $setSelByTxt(o,t) {  // seleciona uma opção, pelo valor mostrado
  t=$String(t).toUpperCase();  if (!$isSelectTag(o=$get(o))) return;
  for (var i=0,len=o.length; i<len; i++) { if ($getSelTxt(o,i).toUpperCase()==t)  return $setSelIndex(o,i) }
  return $setSelNone(o);
};
// Seleciona uma opção pelo valor intrínsico:
function $setSelByVal(o,v) {
  v=$String(v).toUpperCase();  if (!$isSelectTag(o=$get(o))) return;
  for (var i=0,len=o.length; i<len; i++) { if ($getSelVal(o,i).toUpperCase()==v)  return $setSelIndex(o,i) }
  return $setSelNone(o);
};
// Para preencher uma <SELECT> com dados ('^' => separa linhas;  '|' => separa colunas de dados)
function $putSel(src,opt) {
  if ($isString(src))  src=src.split('^');
  var pos=0; if (!$isArray(src) || !(opt=$get(opt)))  return 0;
  for (var len=src.length,opcao; pos<len; pos++) {
    opcao=src[pos].split('|');  // separa as colunas
    if (opcao.length==2) {
      if (pos>=opt.length) {
        var nova=$Doc.createElement('option');
        nova.value=opcao[0];
        nova.text=opcao[1];
        opt.add(nova,null);  // null: adiciona ao final
      } else {
        $setSelVal(opt,pos,opcao[0]);
        $setSelTxt(opt,pos,opcao[1]);
      }
    }
  }
  // Remove as option que sobraram:
  $delSel(opt,pos);
  return pos;
};
// apaga conteúdo de uma <SELECT ...> entre um intervalo determinado
function $delSel(o,from,to) {
  if (!$isSelectTag(o=$get(o))) return;
  if (!$isNatural(from))  from=0;
  if (!$isNatural(to))  to=o.length-1;
  for (var pos=to,until=from; pos>=until; pos--)  o.remove(pos);  // de trás para a frente é mais rápida a remoção
};
// apaga conteúdo de uma <SELECT ...>
function $delSelByVal(o,v) {
  v=$String(v).toUpperCase();  if (!$isSelectTag(o=$get(o))) return;
  for (var i=0,len=o.length; i<len; i++) { if ($getSelVal(o,i).toUpperCase()==v)  $delSel(o,i,i) }
};
// Seleciona uma opção pelo valor intrínsico:
function $sortSelByTxtFromEnd(o) {
  if (!$isSelectTag(o=$get(o))) return;
  var start=o.length-1,done=(start>0);  // se houver só 1 elemento, não precisa ordenar!
  while (done) {
    done=false; if (start>=o.length)  start=o.length-1;
    for (var i=start,t1,t2,v1,v2; i>0; i--) {
      t1=$getSelTxt(o,i-1);
      t2=$getSelTxt(o,i);
      if (t2.toUpperCase()<t1.toUpperCase()) {  // TROCA de posição
        v1=$getSelVal(o,i-1);
        v2=$getSelVal(o,i);
        $setSelTxt(o,i-1,t2);
        $setSelVal(o,i-1,v2);
        $setSelTxt(o,i,t1);
        $setSelVal(o,i,v1);
        if (!done)  start=i+1;  // ganha velocidade, não recomeçando do final
        done=true;
      }
    }
  }
};
//
// Para verificar se é uma check box ( <INPUT TYPE="CHECKBOX"/> ):
function $isCheckBox(o) {
  if (!$isObject(o=$get(o)))  return false;
  return ($String(o.type).toUpperCase()=='CHECKBOX');
};
// Para informar se uma opção foi marcada:
function $getCheck(o) { return ($isCheckBox(o=$get(o)) ? (o.checked ? 1 : 0) : -1) };
// Para marcar uma CheckBox:
function $setCheck(o,v) {
  v=$String(v).toLowerCase();  if ($isCheckBox(o=$get(o)))  o.checked=((v=='true'||$Natural(v)>0)?true:false);
  return $getCheck(o);
};
//
// Para verificar se é uma radio box ( <INPUT TYPE="RADIO"/> ):
function $isRadioBox(o) {
  if (!$isObject(o=$get(o)))  return false;
  return ($String(o.type).toUpperCase()=='RADIO');
};
// Para informar se uma opção está selecionada:
function $getRadio(o) { return ($isRadioBox(o=$get(o)) ? (o.checked ? 1 : 0) : -1) };
//
// Retorna a lista de RadioBox:
function $getRadioList(f) {
  var rsp=new Array(),tags=$getByTag('INPUT');  if (!(tags.length) || $isEmpty(f)) return rsp;  // retorna vazio
  f=f.toUpperCase();
  for (var i=0,tag; i<tags.length; i++) {
    tag=tags[i];  if ($isEmpty(tag.type) || $isEmpty(tag.name)) continue;
    if (tag.type.toUpperCase()!='RADIO')  continue;  //  || $isEmpty($getVal(tag))
    if (tag.name.toUpperCase()==f)  rsp.push(tag);  // adiciona a opção
  }
  return rsp;  // retorna todas as opções
};
// Retorna o objeto que foi marcado de uma lista de RADIO BOX:
function $getOptionObj(f) {
  for (var i=0,tags=$getRadioList(f); i<tags.length; i++) {
    if (tags[i].checked)  return tags[i];  // retorna a opção marcada
  }
  return;  // nenhum foi marcado, ou inexistente
};
// Desmarca todas as opções das RadioBox de um Form:
function $setOptionNone(f) {
  var tags=$getRadioList(f);
  for (var i=0; i<tags.length; i++)  tags[i].checked=false;  // desmarca
  return tags;  // retorna a lista
};
// Marca uma RadioBox pelo valor:
function $setOptionByVal(f,v) {
  var rsp;
  for (var i=0,tags=$getRadioList(f),lst,v=$String(v); i<tags.length; i++) {
    if ($getVal(tags[i])!=v || rsp) {
      tags[i].checked=false;
      continue;
    }
    $opcaoEmNegrito(tags[i]);
    tags[i].checked=true;
    lst=v.split('|');  if ($notEmpty(lst[1]))  $setVal(f,lst[1]);
    rsp=tags[i];  // retorna a opção marcada
  }
  return rsp;  // retorna a opção que foi marcada, se foi encontrada
};
// Marca uma RadioBox pelo ID:
function $setOptionById(f,id) {
  var rsp;
  for (var i=0,tags=$getRadioList(f),lst,v=$String(id); i<tags.length; i++) {
    if ($String(tags[i].id)!=v || rsp) {
      tags[i].checked=false;
      continue;
    }
    tags[i].checked=true;
    rsp=tags[i];  // retorna a opção marcada
  }
  return rsp;  // retorna a opção que foi marcada, se foi encontrada
};
// Captura uma RadioBox pelo valor:
function $getOptionByVal(f,v) {
  for (var i=0,tags=$getRadioList(f),v=$String(v); i<tags.length; i++) {
    if ($getVal(tags[i])==v)  return tags[i];  // retorna o objeto solicitado
  }
  return;  // nenhum valor encontrado
};
//
// Retorna a lista de CHECKBOX:
function $getCheckList(f) {
  var rsp=new Array(),tags=$getByTag('INPUT');  if (!(tags.length) || $isEmpty(f)) return rsp;  // retorna vazio
  f=f.toUpperCase();
  for (var i=0,tag; i<tags.length; i++) {
    tag=tags[i];  if ($isEmpty(tag.type) || $isEmpty(tag.name)) continue;
    if (tag.type.toUpperCase()!='CHECKBOX')  continue;
    if (tag.name.toUpperCase()==f)  rsp.push(tag);  // adiciona a opção
  }
  return rsp;  // retorna todas as opções do formulário
};
// Retorna os objetos que NÃO estão marcados de uma lista de uma CHECKBOX:
function $getNotChecked(f) {
  var rsp=new Array(),tags=$getCheckList(f);  if (!(tags.length)) return;  // faltam parâmetros
  for (var i=0,tag; i<tags.length; i++) {
    if (!(tags[i].checked))  rsp.push(tags[i]);  // adiciona a opção NÃO marcada
  }
  return rsp;  // retorna todas as opções NÃO marcadas
};
// Retorna os objetos que estão marcados de uma lista de CHECKBOX:
function $getCheckedObj(f) {
  var rsp=new Array(),tags=$getCheckList(f);  if (!(tags.length)) return;  // pode ter ocorrido um erro
  for (var i=0; i<tags.length; i++) {
    if (tags[i].checked) rsp.push(tags[i]);  // adiciona a opção marcada
  }
  return rsp;  // retorna todas as opções marcadas
};
// Marca o objeto de uma CHECKBOX que tenha o 'valor':
function $setCheckedByVal(f,v) {
  var tags=$getCheckList(f),v=$String(v);
  for (var i=0; i<tags.length; i++) {
    if ($getVal(tags[i])==v) {
      tags[i].checked=true;
      return tags[i];  // retorna a opção marcada
    }
  }
  return;  // não encontrou a opção
};
function $getCheckedByVal(f,v) {
  var tags=$getCheckList(f),v=$String(v);
  for (var i=0; i<tags.length; i++) {
    if ($getVal(tags[i])==v)  return tags[i];  // retorna a opção solicitada
  }
  return;  // não encontrou o valor solicitado
};
function $setCheckedNone(f) {
  var tags=$getCheckList(f);
  for (var i=0; i<tags.length; i++)  tags[i].checked=false;
  return tags;  // retorna todas as opções desmarcadas
};
// Alinha pela direita, completando os caracteres à esquerda:
function $padL(t,w,ch) {
  t=$String(t);  if (!(w=$Natural(w))) w=3;
  if (!$hasString(ch)) ch='0';
  return (t.length<w ? $repeat(ch,w-t.length) : '')+t;  // Não trunca se for maior que 'w'
};
// Alinha pela esquerda, completando os caracteres à direita:
function $padR(t,w,ch) {
  t=$String(t);  if (!(w=$Natural(w))) w=3;
  if (!$hasString(ch)) ch='0';
  if (t.length<w) return t+$repeat(ch,w-t.length);
  return (t.length>w ? t.substr(0,w) : t);  // TRUNCA se a largura for maior que 'w'
};
// Formata o número a ser exibido (7100.0,3 = 71.000):
function $formatInt(n,f,l) {
  l=$Natural(l);  if ($isEmpty(f) || (f!='.'))  f=',';  // define o caracter que marca o fracionário => PADRÃO é ','
  var d=(f=='.' ? ',' : '.');
  n=$Num(n,f);  if ($isEmpty(n)) return '';
  var sign=(!(n.indexOf('-'))?1:0),pos=n.indexOf(f),t;
  t=(pos<0 ? n.substr(sign) : n.substr(sign,pos-sign));  // INT
  n='';  if (l)  t=$padL(t,l,'0');  // para completar con ZEROS à esquerda
  while (t.length>3) {
    n=d+t.substr(t.length-3)+n;
    t=t.substr(0,t.length-3);
  }
  return (sign?'-':'')+t+n;
};
// Formata o número a ser exibido (7100.0,3 = 71.000,30):
function $formatNum(n,f) {
  if ($isEmpty(f) || (f!='.'))  f=',';  // define o caracter que marca o fracionário => PADRÃO é ','
  var d=(f=='.' ? ',' : '.');
  n=$Num(n,f);  if ($isEmpty(n)) return '0'+f+'00';
  var sign=(!(n.indexOf('-'))?1:0),pos=n.indexOf(f),t;
  t=(pos<0 ? n.substr(sign) : n.substr(sign,pos-sign));  // INT
  n=(pos<0 ? f+'00' : $padR(n.substr(pos),3,'0'));  // FRAC
  while (t.length>3) {
    n=d+t.substr(t.length-3)+n;
    t=t.substr(0,t.length-3);
  }
  return (sign?'-':'')+t+n;
};
// Confere CÓDIGOS, onde só pode haver números:
function $confereNumero(o,min,max) {
  var v=$g(o),num=$Natural(v);  if ($isEmpty(v)) return;
  min=$Natural(min);
  max=$Natural(max);  if (max<1 || max<min) max=$Def.maximum;
  $s(o,(num<min ? min : (num>max ? max : num)));
};
// Confere QUANTIDADES (float/double):
function $confereDouble(o,f) {
  if (!$isObject(o=$get(o)))  return;
  $setVal(o,$formatNum($getVal(o),f));
};
// Remove caracteres inválidos do texto:
function $clearPass(t) {
  var t=$String(t),a=t.replace(eval('/[ \|\^&"\'\+]/g'),'');
  if (a!=t)  alert(">> Os seguintes caracteres NÃO são válidos:\n       ^  \"  |  &  +  '  <space>");
  return a;
};
// Organiza um texto, e remove "'":
function $textoLimpo(v) { return $String(v).replace(eval("/['^&|]/g"),'') };
function $confereTexto(o) {
  var ini=$getVal(o),v=$textoLimpo(ini).ttrim();  if (ini!=v) $setVal(o,v);
};
// Apenas garante que a 1ª letra do texto esteja em maiúscula:
function $firstToUpper(t) {
  var r=$textoLimpo($String(t)).ttrim();
  return r.left(1).toUpperCase()+r.substr(1);
};
// Organiza um texto, remove "'" e garante que a primeira letra é maiúscula:
function $priMaiusc(o) {
  var ini=$getVal(o),r=$firstToUpper(ini);  if (ini!=r) $setVal(o,r);
};
// Para só a primeira letra em minúsculo e o resto em maiúscula:
function $frase(o) {
  var ini=$getVal(o),t=$textoLimpo(ini).ttrim().toLowerCase(),r=t.left(1).toUpperCase()+t.substr(1);  if (ini!=r) $setVal(o,r);
};
// Arruma se tudo estiver em maiúscula, ou se houver texto inválido:
function $confereFrase(o) {
  var ini=$getVal(o),t=$textoLimpo(ini).ttrim(),v=t.toLowerCase(),r=v.left(1).toUpperCase()+v.substr(1),x=ini.toUpperCase();
  if (ini==x)  $setVal(o,r);  // se TUDO em maiúscula, arruma tudo
  else if (ini!=t)  $setVal(o,t);  // se apenas possui caracter inválido (ou desalinhado), não acerta a CAIXA das letras
};
// Organiza um texto, remove "'" e garante que todas as letras sejam maiúsculas:
function $tudoMaiusc(o) {
  if (!$isObject(o=$get(o)))  return;
  $setVal(o,$getVal(o).replace(eval("/['^&|]/g"),'').ttrim().toUpperCase());
};
// Organiza um Nome Próprio, corrigindo maiúsculas e minúsculas:
function $ajustarNomeProprio(txt,noVerify) {
  var t=txt.replace(eval('/[\|\^&"\'\+]/g'),'').replace(eval('/\\s+/g'),' ').split(' ');
  if (!noVerify) {
    var i=0,l=t.length,m=' da das do dos de del e ',vPos;
    while (i<l) {
      t[i]=t[i].toLowerCase();
      vPos=m.indexOf(' '+t[i]+' ');  if (vPos<0)  t[i]=t[i].left(1).toUpperCase()+t[i].substr(1);
      i++;
    }
  }
  t=t.join(' ').trim();  if (t.length)  t=t.left(1).toUpperCase()+t.substr(1);
  return t;
};
function $nomeProprio(o,chk) {
  var txt=$getVal(o=$get(o)),c=$get(chk),t=$ajustarNomeProprio(txt,(c?($getCheck(c)?0:1):0));  if (t!=txt) $setVal(o,t);
  return t;
};
function $nomeComposto(o,chk) {  // ajusta só até o primeiro '-' encontrado
  var txt=$getVal(o=$get(o)),c=$get(chk),nome=txt.tokout(1,'-'),comp=txt.substr(nome.length+1).trim();
  var t=$ajustarNomeProprio(nome,(c?($getCheck(c)?0:1):0)),novo=t+(comp.length?' - ':'')+comp;  if (novo!=txt) $setVal(o,novo);
  return novo;
};
// exibe somente o número (recebe no formato Pt_Br: 100.434,32)
function $exibirNumero(o) {
  if (!$isObject(o=$get(o)))  return;
  var n=$Num($getVal(o),',').replace(eval('/[,]/'),'.');
  $setVal(o,($isEmpty(n) ? '' : $String(Number(n)).replace(eval('/[.]/'),',')));
};
// hora atual:
function $now() { return (new Date()).getTime() };
// obriga o sistema TODO a aguardar 'milisegundos':
function $wait(mili) {
  mili=$Integer(mili,50);  if (mili>2000)  mili=2000;  // mais que 2s, trava!!
  for (var loops=0,start=$now(),end; loops<$Def.maximum; loops++) {
    end=$now();  if (Math.abs(end-start)>mili) break;
  }
};
// Limpa de temporizadores:
function $clear(timer) {
  clearTimeout(timer);
  clearInterval(timer);
};
// Aleatório (com fracionário):
function $random(min,max,dif) {
  min=$Natural(min);
  return (Math.random()*($Integer(max,min+$Integer(dif))-min)+min);
};
// Aleatório (inteiro):
function $rand(min,max) { return Math.floor($random(min,max,2)) };
// Muda a cor de um objeto:
function $color(o,cor) {
  if (!$isObject(o=$style(o))) return;
  var rsp=o.color;  if ($isEmpty(cor))  cor=null;
  o.color=cor;
  return rsp;  // retorna o valor anterior
};
// Muda a cor do FUNDO:
function $backcolor(o,c) {
  if (!(o=$style(o)))  return;
  if ($isEmpty(c)) c='white';
  var rsp=$String(o.background).toUpperCase();
  o.background=c;
  return rsp;  // retorna o valor anterior
};
// Deixa a caixa de seleção com a mesma cor da opção selecionada:
function $bgSelColor(opt,mark) {
  var sty=$style(opt);  if (!sty) return;
  var idx=$getSelIndex(opt),cor=$String($style(opt.options[idx]).backgroundColor);  if ($isEmpty(cor)) cor='white';
  sty.backgroundColor=(idx<($isNatural(mark)?mark:1)?'white':cor);
};
// Transforma texto em Array:
function $serialize(src) {
  if ($isString(src))  return src.split(eval('/[(\\s)|,|;]+/'));
  return ($isArray(src) ? src : new Array());
};
//
// Calcula a posição de um objeto:
function $position(o) {
  var top=0,left=0;
  o=$get(o);
  while(o) {
    top += o.offsetTop || 0;
    left += o.offsetLeft || 0;
    o=o.offsetParent;  // endereço do objeto "pai" do objeto 'o'.
  }
  return new Array(left, top);
};
// Calcula o deslocamento X de um objeto:
function $getOffsetLeft(o) { return ($position(o))[0] };    
// Calcula o deslocamento Y de um objeto:
function $getOffsetTop(o) { return ($position(o))[1] };
// Retorna as dimensões internas do objeto:
function $getInner(obj) {
  var w=0,h=0,o=$get(obj),sty=$style(o);
  if (o&&sty) {
    w=o.clientWidth || sty.width || 0;
    h=o.clientHeight || sty.height || 0;
  }
  return new Array(w,h);
};
// Retorna a largura interna do objeto:
function $getInnerWidth(o) { return ($getInner(o))[0] };
// Retorna a altura interna do objeto:
function $getInnerHeight(o) { return ($getInner(o))[1] };
// Retorna a altura externa do objeto (incluindo borda e padding):
function $getWidthOutter(o) {
  o=$get(o);  if (!o) return 0;
  var h=$String(o.offsetWidth).onlyNum();  if ($notEmpty(h))  return $Natural(h);  // altura interna disponível
  var sty=$style(o);  if (!sty)  return 0;
  return $String(sty.width).toNatural();
};
//
// Calcula a rolagem de um objeto:
function $roll(o) {
  var top=0,left=0;
  o=$get(o);
  while(o) {
    top += o.scrollTop || 0;
    left += o.scrollLeft || 0;
    o=o.offsetParent;  // endereço do objeto "pai" do objeto 'o'.
  }
  return new Array(left, top);
};
// Exibir/ocultar um objeto:
function $invert(o) {
  if ($isNumber(o)) o=$get('opc'+o);
  if (!$isObject(o=$style(o))) return;
  o.display=(($isEmpty(o.display) || o.display=='inline' || o.display=='block') ? 'none' : null);
};
// Exibe um objeto:
function $show(o,t) {
  if (!$isObject(o=$style(o))) return;
  t=$String(t).trim();
  o.display=(t=='null'?null:($isEmpty(t)?'block':t));
};
// Para exibe um objeto na mesma linha que outros já existentes:
function $showInLine(o) {
  if (!$isObject(o=$style(o))) return;
  o.display='inline';
};
function $showArray(l,t) {
  if ($isString(l))  l=l.split(',');
  if (!$isArray(l))  return;
  for (var i=0,len=l.length;i<len;i++)  $show(l[i],t);
};
// Oculta um objeto:
function $hide(o) {
  if (!$isObject(o=$style(o))) return;
  o.display='none';
};
function $hideArray(l) {
  if ($isString(l))  l=l.split(',');
  if (!$isArray(l))  return;
  for (var i=0,len=l.length;i<len;i++)  $hide(l[i]);
};
// Funções para usar com uma tabela:
// Exibe a linha de uma tabela:
function $showRow(o,t) {
  if ($isNumber(o)) o=$get('opc'+o);
  $show(o,($isEmpty(t=$String(t).trim())?'null':t));
};
// Oculta a linha de uma tabela:
function $hideRow(o) {
  if ($isNumber(o)) o=$get('opc'+o);
  $hide(o);
};
// Exibir/ocultar objetos de tabela:
function $invertTable(o) {
  if (!$isObject(o=$style(o))) return;
  o.display=(($isEmpty(o.display) || o.display=='inline' || o.display=='block') ? 'none' : null);
};
// Inverte a linha:
function $invertRow(o) {
  if ($isNumber(o)) o=$get('opc'+o);
  $invertTable(o);
};
// Exibir/ocultar objetos de tabela:
function $invertLine(o) {
  if (!$isObject(o=$style(o))) return;
  o.display=(($isEmpty(o.display) || o.display=='inline' || o.display=='block') ? 'none' : 'inline');
};
// Para exibir/ocultar um objeto, dependendo do estado da "checkbox":
function $checkShow(chk,o,s,h) {
  if ($isNumber(o)) o=$get('opc'+o);
  var c=$getCheck(chk);  if (!$isObject(o=$style(o)) || c<0) return;
  o.display=(c?($isString(s)?s:'block'):($isString(h)?h:'none'));
};
function $checkShowTab(chk,o) { $checkShow(chk,o,'') }; // Exibir/ocultar um objeto de tabela, dependendo do estado da check box
function $checkShowIn(chk,o) { $checkShow(chk,o,'inline') };
function $checkShowTabIn(chk,o) { $checkShow(chk,o,'inline','') };
// Teste de desempenho da CPU:
$Tmp.mySpeed=0;
function $cpuBench() {
  var loops=0;
  for (var start=(new Date()).getTime(),end=0; loops<$Def.maximum; loops++) {
    end=(new Date()).getTime();  if (Math.abs(end-start)>500) break; // 0.5 seg
  }
  return $Tmp.mySpeed=loops; // benchmark value
};
function $cpuNota() {
  if (!$Tmp.mySpeed)  $cpuBench();
  var nota=Math.floor(Math.sqrt($Natural($Tmp.mySpeed-120000)/1000)/5);  // abaixo de 12000 é horrível !!
  return (nota>9?9:nota);
};
//
// Para fazer um objeto piscar:
$Tmp.$blink={
  timer:null,
  obj:null,
  delay:100,
  bg:'',
  color:''
};
// OBS: Se o valor de "backgrd" for NULO (backgrd=null), usa o valor-padrão do objeto-pai.
//      USAR o "setBlink", pois é melhor que "$blink"!
function $blink(row,iter,delay,backgrd,color,forceBg) {
  var d=$Tmp.$blink;  if (d.timer) $clear(d.timer);  // 'd' -> para economizar ...
  iter=$Natural(iter);
  if (iter<1 || d.stop) {
    d.stop=false;
    d.obj=null;
    return;
  }
  if ($isObject(row) || $hasString(row)) {
    $backcolor(d.obj,d.bg);
    if (!$isObject(d.obj=$get(row)))  return;  // armazena o endereço do objeto
    if ($hasString(backgrd) || forceBg) {
      d.bg=backgrd;  // o usuário pode definir
    } else {
      d.bg=$style(d.obj).background;  if ($isEmpty(d.bg))  d.bg='white';
    }
    iter*=2;
    color=$String(color);
    d.color=($isEmpty(color)?'#FF0000':color);  // cor da piscada: vermelha, ou a informada pelo usuário
    d.delay=$Integer(delay,100);
  }
  if (!$isObject(d.obj))  return;
  $backcolor(d.obj,(iter%2 ? d.bg : d.color));
  return (d.timer=setTimeout('$blink("",'+(iter-1)+');',d.delay));
};
// OBS: Se o valor de "backgrd" for NULO (backgrd=null), usa o valor-padrão do objeto-pai.
//      USE o "setBlink" é melhor que "$blink"!
function $setBlink(row,iter,delay,color) {
  var d=$Tmp.$blink;  if (d.timer) $clear(d.timer);  // 'd' -> para economizar ...
  iter=$Natural(iter);
  if (iter<1 || d.stop) {
    d.stop=false;
    d.obj=null;
    return;
  }
  if ($isObject(row) || $hasString(row)) {
    if (!$isObject(d.obj=$get(row)))  return;  // armazena o endereço do objeto
    var original=$String($style(d.obj).background).trim();  if ($isEmpty(original))  original=null;
    d.bg=original;  // fixed: o background pode ser NULO (null)
    iter*=2;
    color=$String(color);  if ($isEmpty(color))  color='#FF0000';  // cor da piscada: vermelha, ou a informada pelo usuário
    d.color=color;
    d.delay=$Integer(delay,200);
  }
  if (!$isObject(d.obj))  return;
  $backcolor(d.obj,(iter%2 ? d.bg : d.color));
  return (d.timer=setTimeout('$setBlink("",'+(iter-1)+');',d.delay));
};
function $blinkStop() {
  var d=$Tmp.$blink;
  $clear(d.timer);
  $backcolor(d.obj,d.bg);
  d.obj=null;
};
//
// Cancelar a propagação do evento do Mouse:
function $cancelEvt(e) {
  e=(e ? e : $Win.Event);  if (!e)  return;
  if (e.stopPropagation)  e.stopPropagation();
  if (e.preventDefault)   e.preventDefault();
  if (!e.cancelBubble)    e.cancelBubble=true;
  if (!e.cancel)          e.cancel=true;
  return false;
};
//
// Procura pelo nome do evento:
function $validEvent(e) {
  e=$String(e).trim().toUpperCase();  if (e.left(2)=='ON')  e=e.substr(2);  // remove o 'on'
  var v=';Abort;Blur;Change;Click;ContextMenu;Copy;Cut;DblClick;DragStart;DragDrop;Error;Focus;KeyDown;KeyPress;KeyUp;Load;'+
        'MouseOver;MouseDown;MouseMove;MouseOut;MouseUp;MouseWheel;Paste;Reset;Resize;SelectStart;Select;Submit;Unload;Scroll;',pos=v.toUpperCase().indexOf(';'+e+';');
  return (pos<0?'':v.substr(pos+1,e.length));  // retorna o nome correto do evento
};
// Função para anexar um evento:
$Cnf.eventType=0;
function $typeOfEvent(o,type) {
  if ($Cnf.eventType<1 && $isObject(o) && $isNatural(type) && (o===$Win || o===$Doc))  $Cnf.eventType=type;
  return $Cnf.eventType;
};
function $addEvent(o,e,callback) {
  if (!(o=$get(o))) return -1;
  if (!$isFunction(callback)) return -2;
  if ($isEmpty(e=$validEvent(e))) return -3;
  // acrescenta o evento:
  if (o.addEventListener) {  // W3C standard
    if (e=='MouseWheel')  o.addEventListener('DOMMouseScroll', callback, false); // corrige nome do evento no IE e no Firefox
    if (e=='Load')  o.addEventListener('DOMContentLoaded',callback, false );
    o.addEventListener(e.toLowerCase(), callback, false); // Obs: sem o 'on...' (scroll, move, mousemove, etc)
    return $typeOfEvent(o,1);
  }
  if (o.attachEvent) {  // IE antes da versão 9
    o.attachEvent('on'+e.toLowerCase(),callback); // Obs: com o 'on...'  (onscroll, onmove, onmousemove, etc)
    return $typeOfEvent(o,2);
  }
  if ($Doc.layers) {  // NSz
    eval('o.on'+e+'=callback;');
    if ($Doc.captureEvents)
      $Doc.captureEvents(Event.ABORT | Event.BLUR | Event.CHANGE | Event.CLICK | Event.COPY | Event.CUT | Event.DBLCLICK |
                   Event.DRAGDROP | Event.ERROR | Event.FOCUS | Event.KEYDOWN | Event.KEYPRESS | Event.KEYUP |
                   Event.LOAD | Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEOUT | Event.MOUSEOVER | Event.MOUSEUP |
                   Event.PASTE | Event.RESET | Event.RESIZE | Event.SELECT | Event.SUBMIT | Event.UNLOAD | Event.SCROLL);
    return $typeOfEvent(o,3);
  }
  if ($Doc.all) { // IE e Moz
    eval('o.on'+e.toLowerCase()+'=callback;');
    return $typeOfEvent(o,4);
  }
  return -4;
};
// Função para remover um evento:
function $delEvent(o,e,callback) {
  if (!$isObject(o=$get(o)) || !$isFunction(callback) || $isEmpty(e=$validEvent(e))) return -1;
  if (o.removeEventListener) {  // W3C
    if (e=='MouseWheel')  o.removeEventListener('DOMMouseScroll',callback,false); // corrige nome do evento no IE e no Firefox
    if (e=='Load')  o.removeEventListener('DOMContentLoaded',callback, false );
    o.removeEventListener(e.toLowerCase(),callback,false);
    return $typeOfEvent(o,1);
  }
  if (o.detachEvent) {  // IE antes da versão 9
    o.detachEvent('on'+e.toLowerCase(),callback);
    return $typeOfEvent(o,2);
  }
  if ($Doc.layers) {  // NS
    eval('o.on'+e+'=null;');
    return $typeOfEvent(o,3);
  }
  if ($Doc.all) { // IE e Moz
    eval('o.on'+e.toLowerCase()+'=null;');
    return $typeOfEvent(o,4);
  }
  return -2;
};
//
// Função para acrescentar um evento a ser disparado:
function $fireMouseEvt(o,e) {
  var evt; if (!$isObject(o=$get(o)) || $isEmpty(e=$validEvent(e).toLowerCase())) return;
  if ($Win.MouseEvent) {
    evt=new MouseEvent(e,{'view':$Win,'bubbles':true,'cancelable':true});  // dispatch for firefox + others:
    evt=$Doc.createEvent('MouseEvents');  // ou 'HTMLEvents'
    evt.initEvent(e,true,true); // event type,bubbling,cancelable
    return !o.dispatchEvent(evt);
  } else if ($Doc.createEventObject) {  // dispatch for IE
    evt=$Doc.createEventObject();  if (!evt) return alert('$fireMouseEvt(1) falhou!');
    return o.fireEvent('on'+e,evt);
  }
  alert('$fireMouseEvt(2) falhou!');
};
//
// Calcula a largura e altura de um texto. Excelente para poder desenhar !!
function $measure(t,size,style,font) {
  var div=$get('_measure_temp'); if (div)  div.parentNode.removeChild(div);  // IMPORTANTE !!
  t=$String(t);  if ($isEmpty(t))  return {width:0,height:0};
  if (!$isInteger(size))  size=12;
  var div=$Doc.createElement('DIV'),resp;
  div.id='_measure_temp';
  $Body.insertBefore(div,$Body.firstChild);  
  if ($notEmpty(style))  div.style=style;
  var sty=$style(div);
  sty.fontFamily=($isEmpty(font)?'Times,"Times New Roman",serif':font);
  sty.fontSize=size+'px';
  sty.position='absolute';
  sty.left=-1000;
  sty.top=-1000;
  sty.whiteSpace='nowrap';
  $setHtml(div,t);
  if ($isNumber(div.clientWidth)) {  // Non-IE
    resp={width:div.clientWidth, height:div.clientHeight}; // IE 6+ in 'standards compliant mode'
  } else if ($isNumber(div.innerWidth)) {
    resp={width:div.innerWidth, height:div.innerHeight};
  } else {
    resp={width:0,height:0};
  }
  div.parentNode.removeChild(div);
  return resp;
};
// Faz um texto encaixar em uma determinada largura:
function $makeFit(t,w,sty) {
  if ($isEmpty(t) || !$isNumber(w) || w<6)  return {'size':0,'width':0,'height':0};
  var w1=$measure(t,16,sty).width,w2=$measure(t,10,sty).width;  if (!w2 || w1==w2)  return {size:0,width:0};
  var siz=Math.floor(10*(16-(6*(w1-w)/(w1-w2))))/10,m;
  while ((m=$measure(t,siz,sty)).width>w && siz>6)  siz=Math.floor(10*siz-1)/10;  // menor fontSize: 6px
  return {'size':siz,'width':m.width,'height':m.height};
};
// Corrige a transparência das imagens PNG no IE 5.5 e 6:
function $fixPNG() {
  var $isIEnavVersion = navigator.appVersion.split('MSIE');
  var $navIEversion = parseFloat($isIEnavVersion[1]);
  try { if (!$isObject($Body.filters))  return; } catch(e) { return }  // IE bug workaround
  if ($navIEversion >= 5.5) {
    for (var i=0; i<$Doc.images.length; i++) {
      var img = $Doc.images[i];
      var imgName = img.src.toUpperCase();
      if (imgName.substring(imgName.length-3, imgName.length) == 'PNG') {
        var imgID = (img.id) ? "id='" + img.id + "' " : '';
        var imgClass = (img.className) ? "class='" + img.className + "' " : '';
        var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
        var imgStyle = 'display:inline-block;' + img.style.cssText;
        if (img.align == 'left') imgStyle = 'float:left;' + imgStyle;
        if (img.align == 'right') imgStyle = 'float:right;' + imgStyle;
        if (img.parentElement.href) imgStyle = 'cursor:hand;' + imgStyle;
        var strNewHTML = '<span ' + imgID + imgClass + imgTitle
          + ' style="' + 'width:' + img.width + 'px; height:' + img.height + 'px;' + imgStyle + ';'
          + 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader'
          + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" ;
          img.outerHTML = strNewHTML;
          i = i-1;
      }
    }
  }
};
//
// Retorna o PATH da URL:
function $infoPath(u) {
  if ($isEmpty(u))  return '';
  var p=u.lastIndexOf('/');  // procura PATH
  return (p<0 ? '' : u.left(p+1));
};
// Retorna o FILE da URL:
function $infoFile(u) {
  if ($isEmpty(u))  return '';
  var p=u.lastIndexOf('/');  // procura PATH
  if (p>=0)  u=u.substring(p+1);
  p=u.indexOf('?');  // procura pela existência de parâmetro  ...
  return (p<0 ? u : u.left(p));  // ... e o remove, se houver.
};
//
// Retorna somente os caracteres válidos para uso na base Hexadecimal:
function $baseFilter(n,base) {
  base=$Integer(base,2);  if (base>$Def.spcHexa.length)  base=16;
  n=$String(n);  if (!$hasString(n)) return '';
  if (base<=$Def.abcHexa.length)  n=n.toUpperCase();
  return n.tokin(1,$Def.spcHexa.left(base));
};
// Converte de uma base qualquer para a Decimal:
function $convertToDec(n,base) {
  base=$Integer(base,2);  if (base>$Def.spcHexa.length)  base=16;
  n=$baseFilter(n,base).split('').reverse();
  var rsp=0;
  for (var i=0,j=n.length;i<j;i++)  rsp+=Math.pow(base,i)*$Def.spcHexa.indexOf(n[i]);
  return rsp;
};
function $hex2Dec(n) { return $convertToDec(n,16) };
// Converte da Base 10 para outra:
function $convertFromDec(n,base) {
  base=$Integer(base,2);  if (base>$Def.spcHexa.length)  base=16;
  n=Number($baseFilter(n,10));  if (!n) return '0';
  var rsp='';
  for (var resto; n; n=(n-resto)/base)  rsp=$Def.spcHexa.substr(resto=(n%base),1)+rsp;
  return rsp;
};
// Converte da base Decimal para a Hexadecimal:
function $dec2Hex(n) { return $convertFromDec(n,16) };
// Dimensões (resolução do monitor) da janela:
function $windowSize() {
  if ($isInteger($Win.innerWidth)) {  // Non-IE (all, except IE)
    return {'width':$Win.innerWidth,'height':$Win.innerHeight};
  } else if ($isInteger($Scr.width)) {
    return {'width':$Scr.width,'height':$Scr.height}; // IE 6.0.2900
  } else if ($Root && $isInteger($Root.clientWidth) ) {
    return {'width':$Root.clientWidth,'height':$Root.clientHeight}; // IE 6+ in 'standards compliant mode'
  } else if ($isInteger($Body.clientWidth)) {
    return {'width':$Body.clientWidth,'height':$Body.clientHeight}; //IE 4 compatible
  }
  return {'width':0,'height':0};
};
// Rolagem da janela:
function $windowScroll() {
  if ($isInteger($Win.pageYOffset)) {  // Netscape
    return {'offX':$Win.pageXOffset,'offY':$Win.pageYOffset};
  } else if ($Root && $isInteger($Root.scrollLeft)) {  // IE 6 Strict Mode
    return {'offX':$Root.scrollLeft,'offY':$Root.scrollTop};
  } else if ($isInteger($Body.scrollLeft)) { // all other Browsers
    return {'offX':$Body.scrollLeft,'offX':$Body.scrollTop};
  }
  return {'offX':0,'offY':0};
};
// Rolagem da janela:
function $setWinScroll(left,top) {
  if ($isNumber($Win.pageYOffset)) {  // Netscape
    $Win.pageXOffset=$Natural(left);
    $Win.pageYOffset=$Natural(top);
  } else if ($Root && $isNumber($Root.scrollLeft)) {  // IE 6 Strict Mode
    $Root.scrollLeft=$Natural(left);
    $Root.scrollTop=$Natural(top);
  } else if ($isNumber($Body.scrollLeft)) { // all other Browsers
    $Body.scrollLeft=$Natural(left);
    $Body.scrollTop=$Natural(top);
  }
};
// Detecta a resolução do monitor:
function $screenSize() { return {'width':($Scr.availWidth || 0),'height':($Scr.availHeight || 0)} };
// Retorna a posição relativa do mouse:
function $mouseXY(e) {
  var rsp=$windowScroll();
  var bad=($Win.ScriptEngine && ScriptEngine().indexOf('InScript')+1) || (navigator.vendor=='KDE');  // NÃO funciona
  rsp['posX']=(bad ? -1 : (e ? ($isNumber(e.pageX) ? e.pageX : ($isNumber(e.clientX) ? e.clientX : 0)) - rsp.offX : 0));  // evt.clientX == $Win.Event.clientX
  rsp['posY']=(bad ? -1 : (e ? ($isNumber(e.pageY) ? e.pageY : ($isNumber(e.clientX) ? e.clientY : 0)) - rsp.offY : 0));  // evt.clientY == $Win.Event.clientY
  return rsp;
};
// Retorna a posição absoluta do mouse:
function $mouse(e){
  var rsp=$windowScroll();
  var bad=( $Win.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || ( navigator.vendor=='KDE' );  // NÃO funciona
  rsp['posX']=(bad ? -1 : (e ? ($isNumber(e.pageX) ? e.pageX : ($isNumber(e.clientX) ? e.clientX : 0)) : 0));  // evt.clientX == $Win.Event.clientX
  rsp['posY']=(bad ? -1 : (e ? ($isNumber(e.pageY) ? e.pageY : ($isNumber(e.clientY) ? e.clientY : 0)) : 0));  // evt.clientY == $Win.Event.clientY
  return rsp;
};
// data atual (dd/mm/aaaa):
function $getYear() {
  var y=(new Date()).getYear();  if (y<1000)  y+=1900;
  return y;
};
function $getMonth() { return ((new Date()).getMonth()+1) };  // "+1" => o sistema retorna de "0"(janeiro) a "11"(dezembro)
function $getDay() { return (new Date()).getDate() };
function $today() { return $padL($getDay(),2,'0')+'-'+$padL($getMonth(),2,'0')+'-'+$getYear() };
// preenche a data de hoje:
function $preencheHoje(o) {$s(o,$today())};
// preenche o ANO atual:
function $preencheAno(o) { $setVal(o,$getYear()) };
// retorna o número da semana de uma data:
function $weekNum(d) {  // segue a iso8601 (usar "d=new Date();")
  var time,checkDate = new Date(d.getTime());
  checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // encontra a QUINTA da semana começando pela SEGUNDA
  time = checkDate.getTime();
  checkDate.setMonth(0); // Compare with Jan 1
  checkDate.setDate(1);
  return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
};
// preenche a HORA atual:
function $horario() {
  var dt=new Date();
  return $padL(dt.getHours(),2,'0')+':'+$padL(dt.getMinutes(),2,'0')+':'+$padL(dt.getSeconds(),2,'0');
};
function $preencheHora(o) { $s(o,$horario()) };
// Informa se o ANO é bissexto:
function $bissexto(ano) {
  ano=$Natural(ano);  if (ano<1) return false;
  return ((ano%100) ? !(ano%4) : !(ano%400)); // bissexto se múltiplo de 4; mas por 100 só de 400 em 400:
};
// Confere uma data, validando limites máximo e mínimo do ANO (formato: DD-MM-AAAA):
function $verificarData(v) {
  var tmp=v.replace(eval('/[\\s\\/,;=\\:]/g'),'-').algarism('\-').trim('-');  if ($isEmpty(tmp))  return '';
  tmp=tmp.split('-');
  // Confere valores:
  var dt=new Date(),dia=$Natural(tmp[0]);  if (!$isInteger(dia) || dia>31) return '>> o "Dia do Mês" é inválido.';
  var mes=$Natural(tmp[1]);  if (!$isInteger(mes) || mes>12)  return '>> o "Mês" é inválido.';
  var ano=$Natural(tmp[2]);
  if (!$isInteger(ano) || ano>=3000 || ano<1000)  return '>> o "Ano" é inválido.'
  // Confere Limites:
  if (mes==4 || mes==6 || mes==9 || mes==11) {
    if (dia>30)  return '>> o "Dia do Mês" está fora do intervalo.';
  } else if (mes==2) {  // fevereiro
    if ($bissexto(ano)) {
      if (dia>29)  return '>> em Fevereiro, o "Dia do Mês" está fora do intervalo.';
    } else {
      if (dia>28)  return '>> O ano informado não é bissesto: o "Dia do Mês" está fora do intervalo.';
    }
  }
  return $padL(dia,2,'0')+'-'+$padL(mes,2,'0')+'-'+ano;
};
// Confere uma data, sem validar limites máximo e mínimo do ANO (formato: DD-MM-AAAA):
function $adjustDate(v) {
  var tmp=v.replace(eval('/[\\s\\/,;=\\:]/g'),'-').algarism('\-').trim('-');  if ($isEmpty(tmp))  return '';
  tmp=tmp.split('-');
  // Confere valores:
  var dt=new Date(),dia=$Natural(tmp[0]);  if (!$isInteger(dia) || dia>31) dia=dt.getDate();  // dia do mês
  var mes=$Natural(tmp[1]);  if (!$isInteger(mes) || mes>12) mes=dt.getMonth()+1;
  var ano=$Natural(tmp[2]);
  if (!$isInteger(ano) || ano>=3000) {
    ano=dt.getYear();  if (ano<1000)   ano+=1900;
  }
  if (ano<100)  ano=Number(ano)+(ano<50 ? 2000 : 1900);
  // Confere Limites:
  if (mes==4 || mes==6 || mes==9 || mes==11) {
    if (dia>30)  dia=30;
  } else if (mes==2) {  // fevereiro
    dia=($bissexto(ano) ? (dia>29 ? 29 : dia) : (dia>28 ? 28 : dia));
  }
  return $padL(dia,2,'0')+'-'+$padL(mes,2,'0')+'-'+ano;
};
function $confereData(o) {
  var v=$g(o),tmp=$adjustDate(v);  if (v!=tmp)  $s(o,tmp);
  return true;
};
// Inverte uma data ("dd-mm-aaaa" retorna "aaaa-mm-dd", ou o contrário):
function $inverterData(dt) {
  dt=$String(dt);  if ($isEmpty(dt) || dt.count('0')>6)  return '';
  return dt.split('-').swap(0,2).join('-');
};
function $adjInvDate(v) { return $adjustDate($inverterData(v)) };  // (formato: AAAA-MM-DD)
//
// Abreviatura do Nome do Dia da Semana:
function $abrevDiaDaSemana(n) {  // data no formato do próprio sistema: "Wed Jun 22 2011 15:44:57 GMT-0300 (Hora oficial do Brasil)"
  n=$Natural(n);  if (n<1 || n>7)  return '';
  var d=new Array('Dom','Seg','Ter','Qua','Qui','Sex','Sab');
  return d[n-1];
};
// Nome do Dia da Semana:
function $nomeDiaDaSemana(n) {
  n=$Natural(n);  if (n<1 || n>7)  return '';
  var d=new Array('Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado');
  return d[n-1];
};
// Abreviatura do Nome do Mês:
function $abrevNomeDoMes(n) {
  n=$Natural(n);  if (n<1 || n>12)  return '';
  var d=new Array('Jan','Fev','Mar','Abr','Maio','Jun','Jul','Ago','Set','Out','Nov','Dez');
  return d[n-1];
};
// Nome do Mês:
function $nomeDoMes(n) {
  n=$Natural(n);  if (n<1 || n>12)  return '';
  var d=new Array('Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro');
  return d[n-1];
};
// Recebe a data "dd-mm-aaaa" e formata a data para exibição "dd-Mmm-aaaa":
function $formatarData(dt) {
  dt=$String(dt).split('-');  if (dt.length<3)  return '';
  return dt[0]+'-'+$abrevNomeDoMes(dt[1])+'-'+dt[2];
};
// Para trabalhar com datas genéricas (dd-mm-????) de eventos (d => data a ser ajustada;  n => número de ordem;  l => largura):
function $eventoAjustar(d,n,l) { return $padL(d.tokout(n,'-/:').replace(eval('/[^0123456789]+/g'),'?'),l,'?').right(l) };
function $eventoFormatar(v) {
  v=$String(v).trim();  if ($isEmpty(v)) return '';
  var d=$eventoAjustar(v,1,2),m=$eventoAjustar(v,2,2),a=$eventoAjustar(v,3,4);
  var data=((d=='00'?'??':d)+'-'+(m=='00'?'??':m)+'-'+(a=='0000'?'????':a));  // garante a largura correta
  return (data=='??-??-????'?'':data);
};
function $eventoDesformatar(v) {  // formato da data "v" => "dd-mm-aaaa"
  var d=$String(v).trim();  if ($isEmpty(d)) return '';
  v=d.split('-');
  for (var i=(v.length-1);i>=0;i--) {
    v[i]=$String(v[i]).ltrim('?');  if ($notEmpty(v[i])) break;
    v=v.remove(i);
  }
  return v.join('-');
};
function $eventoLimpar(o) {  // ONFOCUS
  var d=$getVal(o),v=$eventoDesformatar(d);  if (v!=d)  $setVal(o,v);
};
function $eventoConferir(o) { $setVal(o,$eventoFormatar($getVal(o))) };  // ONBLUR
//
// Confere a hora (formato: HH:MM:SS):
function $confereRelogio(o) {
  if (!$isObject(o=$get(o)) || $isEmpty($g(o)))  return -1;
  $s(o,$g(o).replace(eval('/[\\/,;=-]/g'),':').algarism('\\:'));
  var tmp=$g(o).split(':'),dt=new Date();
  // Confere valores e limnites:
  if ($isEmpty(tmp[0]) || (tmp[0]<0 || tmp[0]>23))  tmp[0]=dt.getHours();  // hora atual
  if ($isEmpty(tmp[1]) || (tmp[1]<0 || tmp[1]>59))  tmp[1]=dt.getMinutes();  // minutos
  if ($isEmpty(tmp[2]) || (tmp[2]<0 || tmp[2]>59))  tmp[2]=dt.getSeconds();  // segundos
  // Armazena data:
  $s(o,$padL(tmp[0],2,'0')+':'+$padL(tmp[1],2,'0')+':'+$padL(tmp[2],2,'0'));
  return 1;
};
//
// Confere a hora (formato: HH:MM):
function $confereHora(o) {
  if (!$isObject(o=$get(o)) || $isEmpty($g(o)))  return -1;
  $s(o,$g(o).replace(eval('/[\\/,;=-]/g'),':').algarism('\\:'));
  var tmp=$g(o).split(':'),dt=new Date();
  // Confere valores e limnites:
  if ($isEmpty(tmp[0]) || (tmp[0]<0 || tmp[0]>23))  tmp[0]=dt.getHours();  // hora atual
  if ($isEmpty(tmp[1]) || (tmp[1]<0 || tmp[1]>59))  tmp[1]=dt.getMinutes();  // minutos
  // Armazena data:
  $s(o,$padL(tmp[0],2,'0')+':'+$padL(tmp[1],2,'0'));
  return 1;
};
//
//
$Dat.$conferirData={
  data:'',
  nomeDiaSem:'',
  tipoExped:-1,
  obs:'',
  callback:null
};
function $limparConferirData(cb) {  // cb -> callback
  var $data=$Dat.$conferirData;
  $data.data=$data.nomeDiaSem=$data.obs='';
  $data.tipoExped=-1;
  $data.callback=($isFunction(cb) ? cb : null);
};
// Funçao para retornar informações sobre uma determinada data:
function $conferirData(o,cb) {
  $limparConferirData(cb);  if (!$confereData(o)) return;
  $Dat.$conferirData.data=$g(o);
  if (!$confereDiaDaSemana) {
    alert('$conferirData() -> precisa da biblioteca "bibValid.js"');
    return;
  }
  $confereDiaDaSemana($inverterData($Dat.$conferirData.data),$conferirDiaDaSemana);
};
function $conferirDiaDaSemana(rsp) {
  var d=$Dat.$conferirData;
  rsp=$String(rsp[0]).trim();  if ($isEmpty(d.data) || $isEmpty(rsp)) return;
  d.nomeDiaSem=$nomeDiaDaSemana(rsp);
  if (!$confereDiaUtil) {
    alert('$conferirDiaDaSemana() -> precisa da biblioteca "bibValid.js"');
    return;
  }
  $confereDiaUtil($inverterData(d.data),$atualizarDiaUtil);  // Verifica se é final de semana/feriado
};
function $atualizarDiaUtil(rsp) {
  var d=$Dat.$conferirData;
  rsp=$String(rsp[0]).trim();  if ($isEmpty(d.data) || $isEmpty(rsp)) return;
  if (!Number(rsp)) {    // 0 => é um feriado, ou é um final de semana;
    if (d.nomeDiaSem=='Sábado' || d.nomeDiaSem=='Domingo') {
      d.tipoExped=1;  // [2] -> NÃO tem expediente (1->final de semana)
      d.obs='(final de semana)';
    } else {
      d.tipoExped=2;  // [2] -> NÃO tem expediente (2->feriado)
      if (!$confereFeriado) {
        alert('$atualizarDiaUtil() -> precisa da biblioteca "bibValid.js"');
        return;
      }
      $confereFeriado($inverterData(d.data),$atualizarNomeDoFeriado);
      return;
    }
  } else {  // >0 => dia de meio de semana
    d.tipoExped=0;  // [2] -> informa se tem expediente (0->dia útil)
    d.obs='(dia com expediente)';
  }
  if ($isFunction(d.callback))  (d.callback)();
};
function $atualizarNomeDoFeriado(rsp) {
  var d=$Dat.$conferirData;
  rsp=$String(rsp[0]).trim();  if ($notEmpty(rsp))  d.obs='('+rsp+')';
  if ($isFunction(d.callback))  (d.callback)();
};
//
// Para listar os números para impressão de página, por exemplo:
function $listarNumeros(l,max) {  // no formato: 'Ex: 1;2;5-9;17;33-42'
  var rsp=new Array(),m=$Natural(max);  if (m<1) m=$Def.maxPage;
  l=$String(l).replace(eval('/[\\s]/g'),'').replace(eval('/,/g'),';').split(';');
  for (var i=0,tmp,ini,fim,pos,j=l.length; i<j; i++) {
    tmp=l[i];  if ($isEmpty(tmp)) continue;
    pos=tmp.indexOf('-');
    if (pos>=0) {  // Se possui um separador de intervalo
      ini=$Natural(tmp.substr(0,pos));
      fim=((pos+1)>=tmp.length ? m : $Natural(tmp.substr(pos+1)))  // string(fim) pode estar vazio! (Ex: '2-')
      if (fim) {
        if (fim>m)  fim=m;
        while (ini<=fim) {
          if (rsp.indexOf(ini)<0)  rsp.push(ini);  // se não estiver na lista, acrescenta
          ini++;
        }
      }
    } else {
      ini=$Natural(tmp);
      if (ini>=0) {
        if (ini>m)  ini=m;
        if (rsp.indexOf(ini)<0)  rsp.push(ini);  // se não estiver na lista, acrescenta
      }
    }
  }
  return rsp.sortNumber();  // ordena na ordem crescente
};
function $agruparNumeros(lst,max) {
  var rsp='';
  for (var i=0,j,lst=$listarNumeros(lst,max),len=lst.length; i<len; i++) {
    j=i;
    if (j<=(len-1)) {
      while (Number(lst[j+1])==(Number(lst[j])+1)) { j++; if (j>=len) break; }
    }
    if (rsp)  rsp+='; ';
    rsp+=''+Number(lst[i])+(i!=j ? '-'+Number(lst[j]) : '');
    i=j;
  }
  return rsp;
};
//
// Funções para menu numerado com `ID` <DIV ID="menu?" CLASS="menuOn | menuOff">:
function $menuAtivar(menu,v) { if (menu=$get(menu)) menu.className=(v ? menu.className.replace('menuOff','menuOn') : menu.className.replace('menuOn','menuOff')) };
// Apenas calcula a posição horizontal do Menu, sem fazer ajustes (a função "$menuAdjust" deve ter sido executada antes, se desejar a posição atual):
function $menuPosHoriz(num) {
  var resp=1;
  for (var count=1,n=$Natural(num),pad=$Tmp.$menuShow.padding,w;count<=n;count++) {
    w=$getInnerWidth('menu'+(count-1));  if (w)  w+=pad;
    resp+=w;
  }
  return resp;
};
function $menuAdjust(pad) {
  pad=$Natural(pad);  if (!pad)  pad=12;
  $Tmp.$menuShow.padding=pad;
  for (var count=1,objMenu,menu,w,left,objSubm,subm,posH;(objMenu=$get('menu'+count)); count++) {
    menu=$style(objMenu);
    menu.top='-80px';
    posH=$menuPosHoriz(count)+'px';
    menu.left=posH;
    // Se não foi definido, acrescenta eventos do menu para tratar passar o mouse e sair do objeto:
    if (!$isFunction(objMenu.onmouseover))  $addEvent(objMenu,'mouseover', Function('','cR(this);'));  // evento para exibir corretamente o submenu ...
    if (!$isFunction(objMenu.onmouseout))  $addEvent(objMenu,'mouseout', Function('','cO(this);'));  // evento para exibir corretamente o submenu ...
    // Configura o submenu, se existir:
    objSubm=$get('smenu'+count);
    if (objSubm) {
      subm=$style(objSubm);
      subm.display='none';
      $addEvent(objSubm,'mouseover', Function('','$menuMouseIn('+count+')'));  // evento para exibir corretamente o submenu ...
      $addEvent(objSubm,'mouseout', Function('','$menuMouseOut('+count+')'));  // ... e para ocultar.
      subm.left=posH;
      subm.top='-160px';
    }
  }
};
//
// Para controlar a exibição do menu:
$Tmp.$menuShow={
  semaforo:0,
  padding:8,
  subInside:0,
  subTimeout:null
};
function $menuMouseIn(num) { $Tmp.$menuShow.subInside=num };
function $menuMouseOut(num) {
  $Tmp.$menuShow.subInside=0;
  $clear($Tmp.$menuShow.subTimeout);
  $Tmp.$menuShow.subTimeout=setTimeout('$menuSubmOut('+num+')',4000);
};
function $menuSubmOut(num) {
  num=$Natural(num);
  $clear($Tmp.$menuShow.subTimeout);
  if (num==$Tmp.$menuShow.subInside) {
    $Tmp.$menuShow.subTimeout=setTimeout('$menuSubmOut('+num+')',4000);
    return;
  }
  $style('smenu'+num).display='none';
};
function $menuShow(e) {
  var menu,wheel,but,$data=$Tmp.$menuShow;
  e=(e ? e : $Win.Event);  if ($data.semaforo) setTimeout($menuShow(e),20);
  $data.semaforo++;
  wheel=(e.detail? e.detail*(-1) : e.wheelDelta/40);
  but=($Win.Event ? e.which : e.button);
  var pos=$mouseXY(e);
  for (var count=1,sty,obj,smenu,pH,posH,offset,exibirSubm; (menu=$get('menu'+count)); count++) {
    sty=$style(menu);
    pH=$menuPosHoriz(count);  // posição horizontal em que o menu deve estar posicionado (levando em consideração apenas a largura dos menus anteriores)
    // Calcula a posição correta para exibir o menu (pois depende da rolagem da tela):
    posH=pH+pos.offX;
    sty.left=posH+'px';  // corrige a posição horizontal do menu
    // Se o mouse estiver no topo da tela, exibe todos os menus:
    if (pos.posY<15) {
      sty.top=(1+pos.offY)+'px';
      obj='smenu'+count;  // procura pela existência de um submenu 
      smenu=$style(obj);  // estilos do submenu
      // ajusta a posição vertical do submenu (se existir):
      if (smenu) {
        exibirSubm=(pos.posX>=pH && pos.posX<=(pH+$getInnerWidth(menu)));  // verifica se o mouse está sobre o menu, levando em consideração a própria largura do menu.
        if (exibirSubm) {
          smenu.left=posH+'px';  // ajusta a posição horizontal do submenu (se existir)
          offset=$getInnerHeight(menu)+$Tmp.$menuShow.padding;
          smenu.top=(1+pos.offY+offset)+'px';
          $show(obj);
          $Tmp.$menuShow.subInside=count;  // número do Submenu que está sendo exibido
          $clear($Tmp.$menuShow.subTimeout);
          $Tmp.$menuShow.subTimeout=setTimeout('$menuSubmOut('+count+')',4000);
        } else {
          $hide(obj);
        }
      }
      $show(menu);
    } else {  // oculta TODOS os menus
      $hide(menu);
      sty.top='-80px';
    }
  }
  delete pos;
  $data.semaforo--;
  return $cancelEvt(e);  // evita que o CLICK se propague!!
};
function $menuHideAll() {
  var $data=$Tmp.$menuShow;  if ($data.semaforo) setTimeout($menuHideAll,100);
  $data.semaforo++;
  for (var count=1,menu,sty; (menu=$get('menu'+count)); count++) {
    $hide('smenu'+count);  // oculta submenu
    sty=$style(menu);  if (sty)  sty.top='-80px';
    $hide(menu);  // oculta menu
  }
  $data.semaforo--;
};
//
// Para exibir ou ocultar a coluna de uma tabela:
function $showHideCol(x) {
  if (!$isNatural(x))  return;
  for (var y=0,col; (col=$get(x+':'+y)); y++)  $invertTable(col);
};
// Para exibir ou ocultar uma linha:
function $showHideLin(y) { if ($isNatural(y))  $invertTable($get('y'+y)) };
// troca as linhas de posição:
function $trocarLinha(lin1,lin2) {
  for (var tmp,cel1,cel2,col=1; ((cel1=$get(col+':'+lin1)) && (cel2=$get(col+':'+lin2))); col++) {
    tmp=$getHtml(cel1);
    $setHtml(cel1,$getHtml(cel2));
    $setHtml(cel2,tmp);
  }
};
// Para mudar uma coluna de posição:
function $trocarNomesTiposColunas(col1,col2) {
  $Win.nomes=$Win.nomes.split(';').swap(col1,col2).join(';');  // inverte os nomes ...
  $Win.tipos=$Win.tipos.split(';').swap(col1,col2).join(';');  // ... e os tipos
};
// *********************************
function $trocarPosicaoColunas(col1,col2) {
  var cel1,cel2,tmp1,tmp2,href1='',href2='',pos;
  col1=$Natural(col1);  col2=$Natural(col2);
  cel1=$get(col1+':0');  // o cabeçalho precisa de uma inversão especial, pois
  cel2=$get(col2+':0');  // há textos de controle: <a href>...</a> e 'align=center'
  // Separa o link:
  pos=(tmp1=$getHtml(cel1)).indexOf('>');  // primeiro cabeçalho
  if (pos>=0) {
    href1=tmp1.substr(0,pos+1);
    tmp1=tmp1.substr(pos+1);
  }
  pos=(tmp2=$getHtml(cel2)).indexOf('>');  // segundo cabeçalho
  if (pos>=0) {
    href2=tmp2.substr(0,pos+1);
    tmp2=tmp2.substr(pos+1);
  }
  // Inverte só conteúdo, mantêm o link:
  $setHtml(cel1,href1+tmp2);
  $setHtml(cel2,href2+tmp1);  // o cabeçalho é centralizado!
  for (var lin=1,tmp; ((cel1=$get(col1+':'+lin)) && (cel2=$get(col2+':'+lin))); lin++) {
    // inverte o conteúdo da célula:
    tmp=$getHtml(cel1);
    $setHtml(cel1,$getHtml(cel2));
    $setHtml(cel2,tmp);
    // inverte o alinhamento da célula:
    tmp=cel1.align;
    cel1.align=cel2.align;
    cel2.align=tmp;
  }
  $trocarNomesTiposColunas(col1-1,col2-1);
};
// Função para carregar os números somente das linhas vistas:
$Dat.$carregarColunasObservadas={
  viewed:new Array(),
  max:0
};
function $carregarColunasObservadas() {
  var count=0,$data=$Dat.$carregarColunasObservadas;
  for (var i=1,sty; (sty=$style(i+':0')); i++) {
    if (sty.display!='none')   $data.viewed[count++]=i;  // armazena o número da coluna observada
  }
  $data.viewed.remove(count);
  $data.max=count;
};
// Função para carregar os números somente das linhas vistas:
$Doc.$carregarLinhasObservadas={
  viewed:new Array(),
  max:0
};
function $carregarLinhasObservadas() {
  var count=0,$data=$Doc.$carregarLinhasObservadas;
  for (var i=1,sty; (sty=$style('y'+i)); i++) {
    if (sty.display!='none')   $data.viewed[count++]=i;  // armazena o número da linha observada
  }
  $data.viewed.remove(count);
  $data.max=count;
};
//
// Para informar o tempo decorrido:
$Dat.$elapsedTime={
  from:new Array(),
  laps:new Array(),
  paused:new Array(),
  sum:new Array()
};
function $elapsedInvalid(n) { return (!$isNatural(n) || !$Dat.$elapsedTime.from[n]) };
function $elapsedStart() {
  var $data=$Dat.$elapsedTime,f=$freeFromArray($data.from);
  $data.sum[f]=0;
  $data.paused[f]=false;
  $data.from[f]=$now();
  return f;
};
function $elapsedTime(n) {
  var $data=$Dat.$elapsedTime;  if ($elapsedInvalid(n)) return 0;
  return $data.sum[n]+($data.paused[n] ? 0 : Math.abs($now()-$data.from[n]));
};
function $elapsedPartial(n) {
  var $data=$Dat.$elapsedTime;  if ($elapsedInvalid(n)) return 0;
  return ($data.paused[n] ? 0 : Math.abs($now()-$data.from[n]));
};
function $elapsedPause(n) {
  var $data=$Dat.$elapsedTime;  if ($elapsedInvalid(n)) return 0;
  if ($data.paused[n])  return $data.sum[n];
  $data.paused[n]=true;
  $data.sum[n]+=Math.abs($now()-$data.from[n])
  return ++$data.laps[n];
};
function $elapsedReinit(n) {
  var $data=$Dat.$elapsedTime;  if ($elapsedInvalid(n)) return 0;
  if ($data.paused[n]) {
    $data.from[n]=$now();
    $data.paused[n]=false;
  }
  return $elapsedTime(n);
};
function $elapsedStop(n) {
  if (!$elapsedPause(n)) return 0;
  $Dat.$elapsedTime.from[n]=null;
  return $data.sum[n];
};
//
// Para controlar a ordenação de colunas de dados:
$Dat.$ordenar={
  sentido:true,  // true: crescente ;  false: decrescente
  numColuna:0,  // última coluna que foi ordenada
  ordenando:false,
  thread:null,
  reiniciar:false,
  parar:false,
  contador:0,
  acumulado:0,
  threadReinit:null
};
function $ordenarInfo(ini,fim) {
  var $data=$Dat.$ordenar;
  $clear($data.threadReinit);
  $data.parar=false;
  $data.numColuna=0;
  alert("A ordenação foi interrompida!\n(entre as linhas "+(ini+1)+' e '+(fim+1)+")\n--> Efetuadas "+$data.acumulado+' trocas');
};
function $ordenarEncerrar(t,ini,fim) {
  var $data=$Dat.$ordenar;
  $elapsedStop(t);
  $splashStop();
  $data.reiniciar=false;
  $data.contador=0;
  $data.ordenado=false;
  if ($data.parar)
    $ordenarInfo(ini,fim);
  else
    alert('Realizadas '+$data.acumulado+" trocas.\n(Máx: "+$Doc.$carregarLinhasObservadas.max+' linhas)');
  $data.acumulado=0;
};
function $ordenarAtDate(t,min,max) {
  var $data=$Dat.$ordenar;  if ($data.parar) return true;
  if ($data.contador>3 || $elapsedTime(t)>20000) {  // mais de 20 seg, pára UMA iteração
    $data.parar=true;
    $clear($data.threadReinit);
    $data.threadReinit=setTimeout('$ordenarEncerrar('+t+','+min+','+max+')',120);
    alert("A operação NÃO foi concluída.  Ela foi\nencerrada por estar demorando muito.");
    return true;
  }
  if ($elapsedTime(t)>9000) {  // 9 segundos
    $elapsedStop(t);
    $data.contador++;
    $splashShow($splashMsg()+'&nbsp;'+$data.contador+'&nbsp;');
    $clear($data.threadReinit);
    $data.threadReinit=setTimeout('$ordenarExecuta('+min+','+max+')',120);
    return true;
  }
  return false;
};
function $ordenarEncimaAbaixo(ehNum,lin,max) {
  var ultimo=0,$line=$Doc.$carregarLinhasObservadas,$data=$Dat.$ordenar;  if (!$isNatural(lin)) lin=0;
  for (var lin1,lin2,cel1,cel2,valor1,valor2,inverter; lin<max; lin++) {
    if ($data.parar)   return -1;
    lin1=$line.viewed[lin];  // Nr da linha vista
    lin2=$line.viewed[lin+1];  // Nr da próxima linha vista
    cel1=$get($data.numColuna+':'+lin1);
    cel2=$get($data.numColuna+':'+lin2);
    if (cel1 && cel2) {
      valor1=$getHtml(cel1);
      valor2=$getHtml(cel2);
      inverter=(ehNum ? (Number(valor1)>Number(valor2)) : (valor1>valor2));
      if (inverter) {
        $data.acumulado++;
        $trocarLinha(lin1,lin2);
        if ((lin+1)>ultimo)  ultimo=lin+1;
      }
    }
  }
  return ultimo;
};
function $ordenarAbaixoEncima(ehNum,lin,max) {
  var primeiro=max,$line=$Doc.$carregarLinhasObservadas,$data=$Dat.$ordenar;  if (!$isNatural(lin)) lin=0;
  for (var lin1,lin2,cel1,cel2,valor1,valor2,inverter; max>lin; max--) {
    if ($data.parar)   return -1;
    lin1=$line.viewed[max-1];  // Nr da linha vista
    lin2=$line.viewed[max];  // Nr da próxima linha vista
    cel1=$get($data.numColuna+':'+lin1);
    cel2=$get($data.numColuna+':'+lin2);
    if (cel1 && cel2) {
      valor1=$getHtml(cel1);
      valor2=$getHtml(cel2);
      inverter=(ehNum ? (Number(valor1)>Number(valor2)) : (valor1>valor2));
      if (inverter) {
        $data.acumulado++;
        $trocarLinha(lin1,lin2);
        if ((max-1)<primeiro)  primeiro=(max-1);
      }
    }
  }
  return primeiro;
};
function $ordenarInverter() {
  for (var linha=0,lin1,lin2,$line=$Doc.$carregarLinhasObservadas,max=($line.max-1); linha<max; linha++,max--) {  //  Apenas inverte as linhas
    lin1=$line.viewed[linha];  // Nr da primeira linha vista ...
    lin2=$line.viewed[max];  // ... da última linha vista
    $trocarLinha(lin1,lin2);
  }
};
function $ordenarExecuta(menor,maior) {
  var ehNum,numeros=' int double float bigint decimal real ',$data=$Dat.$ordenar;
  // Limpa as threads:
  $clear($data.thread);
  $clear($data.threadReinit);
  // Tipo de coluna (é númerica??):
  ehNum=$Win.tipos.split(';');
  ehNum=($data.numColuna ? ehNum[$data.numColuna-1] : null);
  if (ehNum)  ehNum=(numeros.indexOf(ehNum)>=0 ? 1 : null);
  // Para saber se está demorando:
  var t=$elapsedStart(),primeiro,ultimo,linha=0,max=($Doc.$carregarLinhasObservadas.max-1);
  if ($isNatural(menor))  linha=menor;
  if ($isNatural(maior))  max=maior;
  while (max) {
    if ((ultimo=$ordenarEncimaAbaixo(ehNum,linha,max))<0)  break; // Se demorar ordenando, encerra esta rotina e agenda uma nova execução
    max=ultimo;
    if ((primeiro=$ordenarAbaixoEncima(ehNum,linha,max))<0)  break; // Se demorar ...
    if (primeiro>=max)  break;
    linha=primeiro;
    if ($ordenarAtDate(t,linha,max))  return;  // Se demorar ...
  }
  $ordenarEncerrar(t,linha,max);
};
function $ordenar(colNum) {
  var $data=$Dat.$ordenar;
  if ($data.ordenado) {
    $data.parar=true;
    return;  // TODAS as interfaces com o usuário precisam ter semáforos !!
  }
  $data.ordenado=true;
  $carregarColunasObservadas()
  $carregarLinhasObservadas();
  // Verifica se é a mesma coluna anterior ...
  if (colNum==$data.numColuna) {  // ... logo, já foi ordenada.
    $ordenarInverter();
    $data.ordenado=false;
    return;
  }
  // Inicia a ordenação das linhas:
  $splashShow();
  $data.numColuna=colNum;
  if ($data.thread)  $clear($data.thread);
  $data.thread=setTimeout('$ordenarExecuta(0,'+($Doc.$carregarLinhasObservadas.max-1)+')',120);  // NÃO serve setInterval( )
};
//
// Cria e inicializa o AJAX:
$Cnf.ajaxType=0;
function $createAjax() {
  var req;
  try {
    if ($Win.XMLHttpRequest && ($Win.location.protocol !== 'file:' || !$Win.ActiveXObject)) {
      req=new XMLHttpRequest();
      $Cnf.ajaxType=6;
      return req;
    }
  }catch(e){}
  var lista=['MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
  for (var n=0,peso=[5,4,3,2,1];n<lista.length;n++) {
    try {
      if (req=new ActiveXObject(lista[n])) {
        $Cnf.ajaxType=peso[n];
        break;
      }
    }catch(e){req=null}
  }
  return req;
};
var request=$createAjax();
//
// Retorna o primeiro item livre:
var $ajaxList=new Array(),$ajaxRun=new Array();
function $ajaxFree() {
  var free=$freeFromArray($Win.$ajaxList);
  $Win.$ajaxList[free]=1;  // empenha a posicao
  return free;
};
// Apaga a instância do AJAX:
function $ajaxDelete(n) {
  if ($isNatural(n) && $Win.$ajaxList[n]) {
    delete $Win.$ajaxList[n].req;
    delete $Win.$ajaxList[n];
    delete $Win.$ajaxRun[n];
  }
};
// Cria a classe AJAX:
function $ajaxDispacher(n) {
  if (!$isNatural(n))  return;
  if (!$Win.$ajaxRun[n])
    $Win.$ajaxRun[n]=new Function("if ($Win.$ajaxList["+n+"].req.readyState==4 && (($Win.$ajaxList["+n+"].req.status==200 || $Win.$ajaxList["+n+"].req.status==0))) {"+"($Win.$ajaxList["+n+"].exec)(unescape($Win.$ajaxList["+n+"].req.responseText).replace(eval('/[+]/g'),' ').split('&').replace('##26;','&').replace('##2B;','+').replace('##3F;','?'));  $ajaxDelete("+n+"); }");
  return $Win.$ajaxRun[n];
};
//
function $AJAX(url,dados,exec) {
 try  {
  if ($isEmpty(url) || !$isFunction(exec))  return -1;
  dados=$String(dados).trim('?');
  var pos=$Win.$ajaxFree();
  $Win.$ajaxList[pos]={
    'init':false,
    'req':$Win.$createAjax(),
    'url':url,
    'dados':dados,
    'exec':exec
  };
  if (!$Win.$ajaxList[pos].req)  return -2;  // AJAX não incializado
  // Enviar a requisição:
    // GET  ==> poucas informações a serem repassadas (evitar)
    // POST ==> aceita parâmetros longos
    var req=$Win.$ajaxList[pos].req;
    dados='dados='+escape(dados);
    req.open('POST', url, true);  // aqui se acrescenta usuário/senha
    req.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('Content-Length',dados.length);
    req.onreadystatechange=$Win.$ajaxDispacher(pos);  // requestStateChange;
    $Win.$ajaxList[pos].init=true;
    req.send(dados);  // dados a serem enviados
    return pos;
 } catch(e) {
   alert("$AJAX() ==> Não consegui conectar!\nMotivo: "+e.toString()+"\nURL: "+url+"\nReqType: "+$Cnf.ajaxType);
   return -3;
 }
};
// Envia os comandos assíncronos:
function $sendAjax($url,$dados,$exec) {
  var req=$Win.request;  if (!req)  throw('$sendAjax(): Sem suporte a AJAX.');
  if ($isEmpty($url) || $isEmpty($dados) || !$isFunction($exec))  return -1;
  try  {
    // GET  ==> poucas informações a serem repassadas (evitar)
    // POST ==> aceita parâmetros longos
    $dados='dados='+escape($dados);
    req.open('POST', $url, true);  // aqui se acrescenta usuário/senha
    req.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('Content-length',$dados.length);
    req.onreadystatechange=$exec;  // requestStateChange;
    req.send($dados);  // dados a serem enviados
    return 0;
  } catch(e) {
    alert("$sendAjax():\n ==> Não consegui conectar!\n" + e.toString());
    return -2;
  }
};
// Captura o texto entre 2 caracteres solicitados:
function $capturar(t,c1,c2) {
  if ($isEmpty(t) || $isEmpty(c1) || $isEmpty(c2))  return '';
  var m=t.toUpperCase().indexOf(c1.toUpperCase());
  if (m>=0) {
    var tmp=t.substr(m+c1.length),n=tmp.toUpperCase().indexOf(c2.toUpperCase());
    if (n>=0)  return tmp.substr(0,n);
  }
  return '';
};
// Função geral de aviso:
function $drama(e) {
  $cancelEvt(e);  if ($isEmpty($Win.sessionKey))  $Win.sessionKey='(ausente)';
  alert('Session Key: '+$Win.sessionKey);
};
//
// Animação de estilo (usada pelo $tween):
$Dat.$animar={
  obj:new Array(),
  sty:new Array(),
  to:new Array(),
  speed:new Array(),
  step:new Array(),  // passo em pixels
  thread:new Array()
};
function $animInvalid(n) { return (!$isNatural(n) || !$Dat.$animar.obj[n]) };
function $animClear(n) {
  var $data=$Dat.$animar;  if ($animInvalid(n)) return;
  $clear($data.thread[n]);
  $data.obj[n]=null;
};
function $animar(n) {
  var $data=$Dat.$animar;  if ($animInvalid(n)) return;
  $clear($data.thread[n]);
  var tmp='$style($Dat.$animar.obj['+n+']).'+$data.sty[n],atual=Number($String(eval(tmp)).tokin(1,$Def.integer));  if (atual==$data.to[n])  return $animClear(n);
  var jump=$data.step[n]*(atual>$data.to[n] ? -1 : 1),novo=atual+jump;  // cálculo da nova posição
  var to=(atual>$data.to[n] ? (novo<$data.to[n] ? $data.to[n] : novo) : (novo>$data.to[n] ? $data.to[n] : novo));  // verifica se já passou do destino
  eval(tmp+'='+to);  // atualiza o atributo
  if (Number($String(eval(tmp)).tokin(1,$Def.integer))==$data.to[n])  return $animClear(n);
  $data.thread[n]=setTimeout('$animar('+n+')',$data.speed[n]);
};
function $animStart(o,sty,to,speed) {
  o=$get(o);  if (!o)  return;
  var $data=$Dat.$animar,n=$freeFromArray($data.obj);
  $data.obj[n]=o;
  $data.sty[n]=sty;  // texto do estilo
  $data.to[n]=to;
  $data.step[n]=1;
  $data.speed[n]=$Integer(speed,20);
  $data.thread[n]=setTimeout('$animar('+n+')',$data.speed[n]);
  return n;
};
// Função para animar um atributo de estilo:
function $tween(o,sty,to,speed) { return $animStart(o,sty,to,speed) };
// 
// Controle dos temporizadores de "atraso" na execução de uma tarefa:
$Dat.$submenu={
  delay:new Array(),
  exec:new Array(),
  qtd:new Array(),
  thread:new Array()
};
function $delayLimparThread() {
  for (var pos=0,delay=$Dat.$submenu.delay,thr=$Dat.$submenu.thread,len=thr.length; pos<len; pos++) {
    if (thr[pos])  $clear(thr[pos]);
    thr[pos]=null;
    delay[pos]=0;
  }
};
function $freeDelay() {
  var pos=0;
  for (var thr=$Dat.$submenu.thread,len=thr.length; pos<len; pos++) { if (!thr[pos])  break; }
  return pos;
};
function $afterDelay(num) {
  var $data=$Dat.$submenu,thr=$data.thread,tmp='';  if (!$isNatural(num) || thr.length<1) return;
  if ($data.delay[num]>0) {
    if ($isFunction($data.exec[num]))  tmp='($Dat.$submenu.exec['+num+'])()';
    else if ($isString($data.exec[num]))  tmp='$Dat.$submenu.exec['+num+']';
    try {
      eval(tmp);
      $delayLimparThread();
      return;
    } catch(e) {}
  }
  if ($isNatural($data.qtd[num])) {
    $data.qtd[num]++;  if ($data.qtd[num]<10) thr[num]=setTimeout('$afterDelay('+num+')',$data.delay[num]);
  }
};
function $delay(wait,exec) {
  if (!$isFunction(exec)) return;
  wait=$Integer(wait,50);  if (wait>30000) wait=30000;
  var $data=$Dat.$submenu,pos=$freeDelay();
  $data.delay[pos]=wait;  // tempo de espera
  $data.exec[pos]=exec;  // função
  $data.qtd[pos]=0;  // quantidade de execuções
  $data.thread[pos]=setTimeout('$afterDelay('+pos+')',wait);
};
//
// Janela tipo Splash:
$Dat.$splash={
  thread:null,
  count:0,
  splash:null,
  splashKey:''
};
function $splashMsg() { return 'Aguarde ...' };
function $splashCreate(txt) {
  var div=$get('splash');  if (!div) div=$Doc.createElement('div');
  div.id='splash';
  $setHtml(div,txt);
  var sty=$style(div);
  sty.position='absolute';
  sty.display='none';
  sty.backgroundColor='black';
  sty.color='yellow';
  sty.textAlign='center';
  sty.fontSize='12px';
  var siz=$measure(txt,12);  // medidas do texto
  sty.width=null;
  sty.height=null;
  sty.maxHeight='160px';  // altura máxima
  sty.width=null;
  sty.overflowX='hidden';
  sty.overflowY='auto';
  sty.zIndex=9999;
  sty.border='3px outset silver';
  $changeOpac(div,90);
  // Use insertBefore instead of appendChild to circumvent an IE6 bug.  (body[0].appendChild(div);)
  $Body.insertBefore(div,$Body.firstChild);
  return div;
};
function $splashInit(txt) {
  if ($isEmpty(txt))  txt=$splashMsg();
  var div=$get('splash');
  if (div)  $setHtml(div,txt);
  else  div=$splashCreate(txt);
  var res=$windowSize(),scroll=$windowScroll();
  $style(div).top=((res.height-22)>>1)+scroll.offY;
  $style(div).left=((res.width-108)>>1)+scroll.offX;
  return div;
};
function $splashShow(txt) {
  var div=$splashInit(txt);
  $show(div);
  return div;
};
function $splashHide() {
  var div=$get('splash');  if (!div) div=$splashInit(txt);
  $hide(div);
};
function $splashStop() {
  var dat=$Dat.$splash,tmp=$Tmp.splash;
  $clear(dat.thread);
  $clear(tmp.timer);
  dat.count=0;
  var div=$get('splash');  if (!div) return;
  $hide(div);
  $setHtml(div,$splashMsg());  // restaura o conteúdo
};
function $splashInvert() {
  var div=$get('splash'),$data=$Dat.$splash;  if (!div) return;
  if ($data.count<1) {
    $splashStop();
    return;
  }
  $invert(div);
  $data.count--;
  $data.thread=setTimeout('$splashInvert()',1000);
};
function $splashBlink(t) {
  var $data=$Dat.$splash;  if ($data.thread) $splashStop();
  $splashShow(t);
  $data.count=60;
  $data.thread=setTimeout('$splashInvert()',1000);
};
// monta uma pesquisa de dados (para SQL):
function $splashFound(txt,tok) {
  tok=$String(tok).replace(eval('/[;.,-_+@:=(){}[]<>|!?#$%&*"]/g'),' ').split(' ');
  var r='';
  for (var i=0,l=tok.length;i<l;i++) {  // captura cada palavra digitada, para montar a pesquisa:
    if ($isEmpty(tok[i]))  continue;
    r+=(i?' AND ':'')+'instr('+txt+',"'+tok[i]+'")>0';
  }
  return r;
};
// Para pausar o cronômetro porque o MOUSE está sobre a caixa SPLASH:
function $splashOver() {
  $Tmp.splash.over=true;
  $clear($Dat.$splash.thread);
  $clear($Tmp.splash.timer);
};
// Para reiniciar o cronômetro porque o MOUSE está OUT desta caixa:
function $splashOut() {
  $Tmp.splash.timer=setTimeout('$splashStop();',8000);
  $Tmp.splash.over=false;
};
// monta as DIV de exibição dos dados encontrados com SQL:
function $splashMount(rsp,cb,txt) {  // cb = callback
  rsp=$String(rsp);  if (rsp.left(2)=='==')  return '';
  rsp=rsp.split('^');  if ($isEmpty(cb) || rsp.length>12) return '';  // == Consulta Vazia ==
  var r='';  if ($isEmpty(txt))  txt='[0]';
  for (var i=0,len=rsp.length,tmp,c,t;i<len;i++) {
    tmp=rsp[i].split('|');
    c=$String(cb);  t=txt;
    for (var j=0,l=tmp.length;j<l;j++) {
      c=c.replace('['+j+']',tmp[j]);
      t=t.replace('['+j+']',tmp[j]);
    }
    r+='<div onmouseover="$splashOver();" onmouseout="$splashOut();" onclick="'+c+'" style="cursor:pointer;">'+t+'</div>';
  }
  return r;
};
// Cancela a exibição temporizada de uma Splash:
function $splashCancel() {
  var dat=$Dat.$splash;
  $clear(dat.thread);
  dat.splash=null;
  dat.splashKey='';
  $splashStop();
};
//
// Função para exibir um texto dentro de uma janela:
$Dat.$exibirJanela={
  counter:0
};
function $exibirJanela(txt) {
  // abre uma nova janela:
  var counter=($Dat.$exibirJanela.counter++),w=$Win.open('','winExib'+counter,  // URL (nenhuma), Nome da Janela,
        'scrollbars=yes,location=NO,menubar=NO,titlebar=NO,toolbar=NO,status=NO,width=600,height=400');  // fullscreen=yes
  w.$sty=$style($Body);
  var d=w.document,id='textarea'+counter;  // usada para economizar digitação
  // Output an HTML document, including a form, into the new window.
  d.write('<HTML><HEADER><SCRIPT language="JavaScript">var bodyColor=$sty.background;');  // captura a cor da janela "pai"
  d.write('$sty.background="#333333";');  // escurece o fundo da janela "pai"
  d.write('</SCRIPT></HEADER><BODY bgcolor="#ADFF2F" onBlur="javascript:self.focus();" ');  // #ADFF2F == GreenYellow
  d.write('onBeforeUnload="$sty.background=bodyColor;">');     // restaura a cor da janela "pai"
  d.write('<DIV align=center style="display:block;"><FONT SIZE="3" FACE="helvetica"><B>');
  d.write("Tabela de Dados (use &lt;Ctrl&gt;+'C' para copiar)");
  d.write('</B></FONT><HR SIZE="3" WIDTH="80%">');
  d.write('<textarea id="'+id+'" rows="20" cols="65">'+txt+'</textarea></DIV></BODY></HTML>');
  // Remember to close the document when we're done:
  $get(id).focus();
  $get(id).select();
  d.close();
  delete w;
};
// 
//   In the example below, the text size in em is the same as the previous example in pixels.
//   However, with the em size, it is possible to adjust the text size in all browsers.
// h3 {font-size:1.5em;}     /* 24px/16=1.5em */
// h2 {font-size:1em;}       /* 16px/16=1em   <== é o tamanho padrão dos navegadores */
// h1 {font-size:0.875em;}   /* 14px/16=0.875em */
// p {font-size:0.75em;}     /* 12px/16=0.75em */
// span {font-size:0.625em;} /* 10px/16=0.625em */
function $criarJanela(txt,prn) {
  // abre uma nova janela:
  var counter=($Dat.$exibirJanela.counter++),w=$Win.open('','winCriar'+counter,  // URL e Nome da Janela
        'scrollbars=yes,location=NO,menubar=NO,titlebar=NO,toolbar=NO,status=NO,width=640,height=480'),d=w.document;  // resizable=NO,fullscreen=yes
  w.$sty=$style($Body);
  // Saída dos comandos HTML para montagem da janela:
  if ($isEmpty(txt))  txt='== VAZIO ==';
  d.write('<HTML><HEADER><style type="text/css">');
  if (!prn) {
    d.write('html{margin:2px 2px 2px 2px;padding:0px;} body{background:white;color:black;font-color:black;');
    d.write('margin:4px 4px 4px 4px;padding:0px;width:100%;font-family:"Times New Roman", Times, serif;}');
    d.write('table{empty-cells:show;border-spacing:0px;border-color:black;color:black;font-color:black;font-size:12px;line-break:normal;}');
    d.write('td{border-color:black;} th{border:1px solid #000;color:black;font-color:black;text-align:center;white-space:nowrap;}');
  } else {
    d.write('html{margin:0.2em 0em 0.2em 1em;padding:0em;} body{background:white;color:black;font-color:black;');
    d.write('margin:0.2em 0em 0.2em 2em;padding:0em;width:95%;font-family:"Times New Roman",Times,serif;font-size:0.75em;}');
    d.write('h1{font-size:0.875em;} h2{font-size:1em;} h3{font-size:1.5em;} h4{font-size:1.875em;} h5{font-size:2em;}');
    d.write('table {empty-cells:show;border-spacing:0em;border-color:black;color:black;font-color:black;}');
    d.write('td{border-color:black;} th{border:1px solid #000;color:black;font-color:black;text-align:center;white-space:nowrap;}');
  }
  d.write('p.quebra,table.quebra,tr.quebra{page-break-before:always;} br.quebra{page-break-after:always;}');  // quebras de página
  d.write('@page {size:A4;margin:0;} @media screen,print {.page {margin:0;width:initial;page-break-after:always;}');
  d.write('div.oculto,p.oculto,table.oculto,tr.oculto,span.oculto,input.oculto,img.oculto,fieldset.oculto{display:none;}');  // objetos que não devem ser impressos
  d.write('.destak{border-bottom:1px solid black;} div{max-width:inherit;}}');
  d.write('a:link{text-decoration:none;color:black;} a:hover{color:black;} a:visited{color:black;}');  // arruma os hiperlinks
  d.write('.titulo{text-align:center;align:center;white-space:nowrap;color:black;font-weight:bold;font-variant:small-caps;min-width:600px;}');
  var from=['background:black;','background:#000000;','background:#222;','background:#020;','background:fuchsia;','background:orange;',
            'color:#A9A9A9;','color="red"','color="tomato"','color:white;','color:lime;','color:yellow;','color:red;','color:cyan;',
            'border:3px double yellow;','border:1px solid yellow;','border:1px solid green;','border:1px solid red;','border:1px solid blue;',
            'border:1px solid white;','border-top:1px solid white;','border-bottom:1px solid white;'];
  var to=['','','','','','','color="yellow"','color:yellow;','color="yellow"','color:black;','','','','color:black;', 'border:3px double black;',
          'border:1px solid black;','border:1px solid black;','border:1px solid black;','border:1px solid black;',
          'border:1px solid black;','border-top:1px solid black;','border-bottom:1px solid black;'];
  for (var p=0; p<from.length; p++)  txt=txt.replace(eval('/('+from[p]+')/ig'),to[p]); // Ajusta o conteúdo do texto:
  d.write('</style></HEADER><BODY>'+txt+'</BODY></HTML>');
  if (prn)  d.write('<script language="JavaScript">window.onload=function(){window.print()};</script>');
  // Remember to close the document when we're done:
  d.close();
  return w;
};
//
// Para funcionar os filtros de dados:
$Dat.$loadHeader={
  headers:new Array(),
  checked:new Array(),
  filtered:new Array()
};
function $loadHeader() {
  var i=0,$data=$Dat.$loadHeader;
  for (var o,head,t,p; (o=$get(i+':0')); i++) {
    t=$getHtml(o).replace(eval('/(<BR>)/gi'),' ');
    head=$capturar(t,'>','<');  // remove o link:
    $data.headers[i]=(head.length>35 ? head.left(35) : (head.length ? head : t));
  }
  $data.headers.remove(i);
};
function $loadCheckedCols() {
  var i=0,$data=$Dat.$loadHeader;
  for (var o; (o=$style(i+':0')); i++)  $data.checked[i]=(o.display=='none' ? false : true);
  $data.checked.remove(i);
};
function $loadCheckedLines() {
  var i=0,$data=$Dat.$loadHeader;
  for (var o; (o=$style('y'+(i+1))); i++)  $data.filtered[i]=(o.display=='none' ? false : true);
  $data.filtered.remove(i);
};
//
// Exportar dados da tabela:
function $exportarDados() {
  $loadHeader();
  $loadCheckedCols();
  $loadCheckedLines();
  var $data=$Dat.$loadHeader,fimC=$data.checked.length,rsp="Nr Ord\t";
  // Carrega o cabeçalho:
  for (var iniC=0,head,cel; iniC<fimC; iniC++) {
    if ($data.checked[iniC]) {
      if (!(cel=$get(iniC+':0')))  return '>>';
      head=$capturar($getHtml(cel).replace(eval('/(<BR>)/gi'),' '),'>','<');  // remove o link:
      if (head.trim()=='')  head=$getHtml(cel);
      if (head=='Nr Ord') {  // se repetida, marca a coluna ...
        $data.checked[iniC]=false;  // ... para não ser visualizada!
      } else {
        rsp+=head+"\t";
      }
    }
  }
  rsp+="\n";
  // Carrega os dados:
  for (var iniL=0,fimL=$data.filtered.length,line=1; iniL<fimL; iniL++) {
    if ($data.filtered[iniL]) {
      rsp+=(line++)+"\t";
      for (var iniC=0,cel; iniC<fimC; iniC++) {
        if ($data.checked[iniC]) {
          if (!(cel=$get(iniC+':'+(iniL+1))))  return '>>';
          rsp+=$getHtml(cel)+"\t";
        }
      }
      rsp+="\n";
    }
  }
  $exibirJanela(rsp);
};
//
// Exibe o horário do relógio:
$Dat.$exibirRelogio={
  nome:'relogio',
  running:false,  // false -> parado; true -> running
  obj:null,
  thread:null
};
function $exibirRelogio(o) {
  var $data=$Dat.$exibirRelogio;
  if ($notEmpty(o))  $data.obj=$get($data.nome=o);
  if (!$data.obj || !$data.running)  return;  // relógio parado!
  var hoje=new Date();
  $s($data.obj,$padL(hoje.getHours(),2,'0')+':'+$padL(hoje.getMinutes(),2,'0')+':'+$padL(hoje.getSeconds(),2,'0'));
  $data.thread=setTimeout('$exibirRelogio()',1000);
  $backcolor($data.obj,'White');
};
// Para parar/ligar o relógio:
function $statusRelogio(o) {
  var $data=$Dat.$exibirRelogio;
  if (($data.running=!$data.running)) {  // alterna
    $exibirRelogio(o);  // liga
    return;
  }
  $clear($data.thread);  // desliga
  $backcolor(o,'Salmon');
};
//
// Exibe a hora:
$Dat.$exibirHora={
  nome:'horario',
  running:false,  // false -> parado; true -> running
  obj:null,
  thread:null
};
function $exibirHora(o) {
  var $data=$Dat.$exibirHora;
  if ($notEmpty(o))  $data.obj=$get($data.nome=o);
  if (!$data.obj || !$data.running)  return;  // relógio foi parado!
  var hoje=new Date();
  $s($data.obj,$padL(hoje.getHours(),2,'0')+':'+$padL(hoje.getMinutes(),2,'0'));
  $data.thread=setTimeout('$exibirHora()',60000);  // 60 seg
  $backcolor(o,'White');
};
// Para parar o relógio:
function $statusHora(o) {
  var $data=$Dat.$exibirHora;
  if (($data.running=!$data.running)) {  // alterna
    $exibirHora(o);  // liga
    return;
  }
  $clear($data.thread);  // desliga
  $backcolor(o,'Salmon');
};
//
// Cria formulário para enviar dados via POST:
function $submit(url,dados,target,sep,formul) {
  url=$String(url).trim();  if ($isEmpty(url)) return;
  dados=$montarUrl($String(dados).trim(),sep).trim('?');  // sempre acrescenta parâmetros adicionais
  var input,form=$get('_temp_submit');   if (form) form.parentNode.removeChild(form);  // IMPORTANTE !!
  form=$get(formul);
  if (form&&($String(form.tagName).toUpperCase()!='FORM'))  form=null;  // confere se é um <FORM>
  if (!form) {
    form=$Doc.createElement('FORM');
    form.id='_temp_submit';  // IMPORTANTE !!
  }
  form.method='POST';
  form.action=url;
  form.target=($isEmpty(target) ? url : target); // pode ser:  '_self', '_blank', '_parent', '_top', url  ou a ID de um <iframe>
  // Use insertBefore instead of appendChild to circumvent an IE6 bug.  (body.appendChild(form);)
  $Body.insertBefore(form,$Body.firstChild);
  if (dados) {
    dados=dados.split('&');
    for (var i=0,l=dados.length,sep,found,listaInput=$getByTag('INPUT'),m=listaInput.length; i<l; i++) {
      sep=dados[i].split('=');  if ($isEmpty(sep[0])) continue;
      if (!$isString(sep[1])) sep[1]='';
      // Procura pela existência do INPUT:
      found=-1;
      for (var j=0; j<m; j++) {
        if ($isString(listaInput.id)) {
          if (listaInput.id.toUpperCase()==sep[0].toUpperCase()) {  // se existe ...
            found=j;
            break;  // ... sai do laço!
          }
        }
      }
      // se o INPUT não existe ...
      if (found<0) {
        input=$Doc.createElement('INPUT');
        input.id=input.name=sep[0];
        input.value=sep[1];
        input.type='hidden';
        // Use insertBefore instead of appendChild to circumvent an IE6 bug (form.insertBefore(input,form.firstChild);)
        form.appendChild(input);
        input=null;  // Nullify element to prevent memory leaks in IE (release memory)
      } else {  // mas se  existe, só o atualiza:
        listaInput[found].name=sep[0];
        listaInput[found].value=sep[1];
        listaInput[found].type='hidden';
      }
    }
  }
  if (form)  form.submit();
};
// Confere se no evento "e" foi pressionada a tecla de ASC-II Nº "code":
function $pressedKey(e,code) {
  code=$Natural(code);  if (!e || code<1)  return false;
  var key=($isNumber(e.keyCode) ? e.keyCode : ($isNumber(e.which) ? e.which : 0));  // e.keyCode => IE ; e.which => Netscape/Firefox/Opera
  return (key ? (key==code) : false);  // FALSE => não propaga o comando
};
// Confere se foi pressionada a tecla <Tabulação>:
function $teclaTab(e) { return $pressedKey(e,10) };
// Confere se foi pressionada a tecla <Enter>:
function $teclaEnter(e) { return $pressedKey(e,13) };
// Confere se foi pressionada a tecla <Espaço>:
function $teclaSpace(e) { return $pressedKey(e,32) };
//
// Para possibilitar comparar duas versões de um sistema:
function $ajustarVersao(ver) {
  if ($isEmpty(ver))  return '';
  ver=ver.algarism().split(eval('/[\\s]+/g'));
  for (var i=0;i<4;i++)  ver[i]=$padL((ver[i]?ver[i]:'0'),4,'0');
  return ver.join('.');
};
// Detecta o nível de um Plugin (ex:'Shockwave Flash'):
function $getPlugin(txt) {
  var ver='',nav=$String(navigator.userAgent).toLowerCase();
  if ($isEmpty(nav) || !$isArray(navigator.plugins))  return '0.0';
  for (var pos=0,len=navigator.plugins.length,descrip,i,v; pos<len; pos++) {
    descrip=navigator.plugins[pos].description.trim();
    i=descrip.indexOf(txt);  if (i<0) continue;
    v=descrip.substring(i+txt.length);  if ($ajustarVersao(v)>$ajustarVersao(ver)) ver=v;
  }
  return ($isEmpty(ver) ? '0.0' : ver);
};
// Redirecionamento de página do navegador:
function $ajustarParametros() {
  var k=$String($Win.sessionKey);  if (k.length>58 && k.left(2)=='k=') k=k.substring(2);  // retira 'k='
  $Win.sessionKey=(k.length<32?'':k);
  $Win.sessionUser=$Natural($Win.sessionUser);
  $Win.sessionSist=$Natural($Win.sessionSist);
  $Win.sessionAno=$Natural($Win.sessionAno);
  $Win.sessionInst=$Natural($Win.sessionInst);
  $Win.sessionPage=$Natural($Win.sessionPage);
  $Win.sessionOM=$Natural($Win.sessionOM);
};
function $montarUrl(dados,sep) {
  $ajustarParametros();
  sep=$String(sep).trim();  if (sep=='')  sep='&';  // "sep" não pode conter espaço
  var z=$String(dados).trim('?').trim(),k=$Win.sessionKey;  if (k.length>0)  z+=($isEmpty(z) ? '' : sep)+'k='+k;
  var u=$Win.sessionUser;  if (u)  z+=($isEmpty(z) ? '' : sep)+'u='+u;
  var s=$Win.sessionSist;  if (s)  z+=($isEmpty(z) ? '' : sep)+'s='+s;
  var a=$Win.sessionAno;  if (a)  z+=($isEmpty(z) ? '' : sep)+'a='+a;
  var p=$Win.sessionPage;  if (a)  z+=($isEmpty(z) ? '' : sep)+'p='+p;
  var i=$Win.sessionInst;  if (i)  z+=($isEmpty(z) ? '' : sep)+'i='+i;
  var om=$Win.sessionOM;  if ($Natural(om)>=109)  z+=($isEmpty(z) ? '' : sep)+'om='+om;
  return (z.length>0 ? '?':'')+z;
};
function $locReplaceData(page,dados,sep) {
  if ($isEmpty(page))  return;
  $Win.location.replace(page+$montarUrl(dados,sep));
};
function $locReplace(page) { $locReplaceData(page,'') };
function $locHrefData(page,dados,sep) {
  if ($isEmpty(page))  return;
  $Win.location.href=page+$montarUrl(dados,sep);
};
function $locHref(page) { $locHrefData(page,'') };
// POST de dados para uma determinada página:
function $Submit(page,dados) {
  if ($isEmpty(page))  return;
  $submit(page,dados,'_self');
};
// Envia dados, acrescentando parâmetros:
function $Send(u,$dados,cb,sep) {
  $style($Body).cursor='wait'; if (!$isFunction(cb))  cb=$Win.$retorno;
  $AJAX(u,$montarUrl($dados,sep).trim('?'),cb);
  $style($Body).cursor='default';
};
// Para criar/recuperar Cookies:
function $setCookie(nm,v) {
  if ($isEmpty(nm))  return;
  v=($isEmpty(v) ? '' : v.trim().replace(eval('/[(\\s)|,|;]+/g'),'_'));
  var date=(new Date()).setTime(date.getTime()+$Def.oneWeek),e=';expires='+date.toUTCString(); // IE dont support 'max-age'
  $Doc.cookie=nm+'='+encodeURIComponent(v.trim())+e+';path=;domain=;secure=;';
};
function $getCookie(nm) {
  var s=$Doc.cookie;  if ($isEmpty(s) || $isEmpty(nm)) return '';
  var len=(nm+='=').length,pos=s.indexOf(nm);  if (pos<0) return '';
  var fim=s.indexOf(';',pos+1);
  return decodeURIComponent(fim<0 ? s.substr(pos+len) : s.substr(pos+len,fim-len));
};
// Funções para TEXTAREA:
// Captura a posição do cursor na caixa de texto:
$Cnf.$getCaretType=$Cnf.$setCaretType=-1;
function $getCaretPosition(o,a) {
  if (!$isBoolean(a))  a=true;  // o padrão é avisar!
  if (!$isObject(o=$get(o))) return -1;
  if ($Doc.selection) {  // IE Support
    o.focus();
    var sel=$Doc.selection.createRange();
    $Cnf.$getCaretType=1;
    return sel.moveStart('character',-o.value.length);
  }
  if ($isNumber(o.selectionStart)) {  // Firefox support
    $Cnf.$getCaretType=2;
    return o.selectionStart;
  }
  if (a)  alert('-> gCP: Navegador sem suporte!');
  return -2;
};
// Posiciona o cursor na caixa de texto:
function $setCaretPosition(o,pos) {
  if (!$isObject(o=$get(o)) || !$isNatural(pos)) return -1;
  if (o.setSelectionRange) {  // IE Support
    o.focus();
    o.setSelectionRange(pos,pos);
    return ($Cnf.$setCaretType=1);
  }
  if (o.createTextRange) {  // Firefox support
    var range=o.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos-1);
    range.moveStart('character', pos-1);
    range.select();
    return ($Cnf.$setCaretType=2);
  }
  return -2;
};
// Posiciona o cursor, usando a linha e coluna informados:
function $setCaretLineColPos(o,line,col) {
  o=$get(o);  line=$Num(line);  col=$Num(col);  if (!o||line<0||col<0) return;
  var txt=$getHtml(o),pos=0,len=txt.length,l=0,c=0;
  while (pos<len) {  // procura pela linha
    if (l==line) {
      while (pos<len) {  // procura pela coluna
        if (c==col)  break;
        pos++;  if (txt.substr(pos,1)=="\n")  break;  // achou o final da linha!
        c++;  // próxima coluna
      }
      break;
    }
    pos++;  if (txt.substr(pos,1)=="\n")  l++;  // mudou de linha
  }
  $setCaretPosition(o,pos);
  return pos;  // retorna a posição serial
};
// Conta quantas linhas foram digitadas na caixa de texto:
function $lineCount(o,sep) { return (!$isObject(o=$get(o)) ? 0 : $getVal(o).count($isEmpty(sep)?"\n":sep)) };
// Captura em qual linha está o cursor:
function $getLinePos(o) {
  var num=1;  if (!$isObject(o=$get(o))) return num;
  for (var pos=0,start=$getCaretPosition(o),v=$getVal(o); pos<start; pos++) { if (v.substr(pos,1)=="\n")  num++ }
  return num;
};
// Posiciona o cursor no início da linha:
function $setLineStart(o,n) {
  var pos=0;  if (!$isObject(o=$get(o))) return pos;
  if (!$isInteger(n))  n=1;
  for (var line=1,v=$getVal(o),len=v.length; pos<len; pos++) {
    if (line==n)  break;
    if (v.substr(pos,1)=="\n")  line++;
  }
  $setCaretPosition(o,pos);
  return pos;
};
// Seleciona um intervalo de texto:
function $selectText(o,ini,fim) {
  if (!$isObject(o=$get(o)))  return;
  var len=$getVal(o).length;
  ini=$Natural(ini);  if (ini>len)  ini=len;
  fim=$Natural(fim);  if (fim>len)  fim=len;
  if (fim<ini) {
    var tmp=fim;
    fim=ini;
    ini=tmp;
  }
  if (o.createTextRange) {
    var range = o.createTextRange();
    range.collapse(true);
    range.moveEnd('character', fim-1);
    range.moveStart('character', ini-1);
    range.select();
    $Win.$selectTextType=1;
  }  else if (o.setSelectionRange) {
    o.focus();
    o.setSelectionRange(ini,fim);
    $Win.$selectTextType=2;
  }
};
// Seleciona uma linha inteira:
function $selectLine(o,n) {
  if (!$isObject(o=$get(o)))  return;
  var fim=$setLineStart(o,n+1)-1;
  var ini=$setLineStart(o,n);
  $selectText(o,ini,fim);
};
//
// Funções para manipulação de tabelas:
// Encontra a tabela de uma TD/TR:
function $tableFindTable(el) {
  var name;
  while(el) {
    if ($isString(el.nodeName)) {
      name=el.nodeName.toUpperCase();  if (name=='HTML')  return;  // TABLE inexistente
      if (name=='TABLE')  return el;
    }
    el=el.parentNode;
  }
  return;  // não achou!
};
// Encontra a TR de uma TD:
function $tableFindRow(el) {
  var name;
  while(el) {
    if ($isString(el.nodeName)) {
      name=el.nodeName.toUpperCase();  if (name=='HTML')  return;  // TR inexistente
      if (name=='TR')  return el;
    }
    el=el.parentNode;
  }
  return;  // não achou!
};
// Retorna a linha TR de mesmo nível, anterior:
function $tablePreviousRow(el) {
  var tr=$tableFindRow(el);
  return (tr?tr.previousElementSibling:null);
};
// Encontra a TD de uma objeto:
function $tableFindData(el) {
  var name;
  while(el) {
    if ($isString(el.nodeName)) {
      name=el.nodeName.toUpperCase();  if (name=='HTML')  return;  // TD inexistente
      if (name=='TD')  return el;
    }
    el=el.parentNode;
  }
  return;  // não achou!
};
// Retorna a linha TD de mesmo nível, anterior:
function $tablePreviousData(el) {
  var td=$tableFindData(el);
  return (td?td.previousElementSibling:null);
};
// Remove uma linha da tabela:
function $tableRemoveRow(el,conf) {
  var row=$tableFindRow(el);  if (!row) return;
  var lin=row.rowIndex;
  if (conf) {
    var id=row.getAttribute('id');  if ($isEmpty(id))  id=lin;
    if (!confirm('-> Tem certeza que deseja apagar a linha "'+id+'"?'))   return;
  }
  var table=$tableFindTable(row);  if (!table)  return;
  table.deleteRow(row.rowIndex);  // apaga uma linha da tabela
  return lin;
};
// Insere uma linha na tabela:
function $tableInsertBeforeRow(el,attribs,htmls) {
  var row=$tableFindRow(el);  if (!row || !htmls) return;
  var table=$tableFindTable(row);  if (!table) return;
  var i=0,tr=table.insertRow(row.rowIndex);
  for (var max=htmls.length; i<max; i++) {
    var td=$Doc.createElement('TD');
    if ($isArray(attribs[i])) {
      for (var attr=attribs[i],l=0,qtd=attr.length; l<qtd; l++)  td.setAttribute(attr[l][0],attr[l][1]);  // [[atrib,value],[atrib,value],...]
    }
    if (htmls[i])  $setHtml(td,htmls[i]);  // HTML do <TD></TD>
    // Use insertBefore instead of appendChild to circumvent an IE6 bug (tr.insertBefore(td,tr.firstChild);)
    tr.appendChild(td);
  }
  return i;
};
// Insere uma linha na tabela:
function $tableAppendRow(table,attribs,htmls) {
  if (!table ||  (!table.nodeName || table.nodeName!='TABLE' || !htmls))  return;
  for (var tr=table.insertRow(-1),i=0,max=htmls.length; i<max; i++) {  // insere a linha <TR>
    var td=tr.insertCell(-1);  // insere uma <TD> na linha
    if (attribs  &&  attribs[i]) {  // atributos do <TD>
      for (var attr=attribs[i],l=0,qtd=attr.length; l<qtd; l++)  td.setAttribute(attr[l][0],attr[l][1]);  // [[atrib,value],[atrib,value],...]
    }
    if (htmls[i])  td.innerHTML=htmls[i];  // HTML do <TD></TD>
  }
};
// Retorna a lista de <TD> de uma linha da tabela:
function $tableRowListData(el) {
  var td=new Array(),row=$tableFindRow(el);  if (!row) return;
  for (var i=0,max=row.cells.length; i<max; i++)   td[i]=row.cells[i];
  return td;
};
// Procura pela "ené"sima ocorrência do tipo de NÓ especificado:
function $findChildNode(obj,typ,pos) {
  var o=$get(obj);  if (!o)  return;  // objeto inválido
  try {
    var t=$String($Defined(typ)?typ:o.nodeName).trim().toUpperCase();  // padrão é procurar pelo "nodeName" igual ao do OBJ informado
    for (var i=0,n=0,p=$Integer(pos),lst=o.childNodes,qtd=lst.length;i<qtd;i++) {
      name=$String(lst[i].nodeName).toUpperCase();  // pode ser vazio (name=='')
      if (name==t) {  // confere o tipo ...
        if ((++n)==p) return lst[i];  // ... e procura pelo enésimo objeto
      }
    }
  }catch(e){}
};
// Procura pelo "ené"simo NÓ do tipo especificado, de MESMO nível da árvore (padrão é procurar pelo "nodeName" igual ao do OBJ informado):
function $findSiblingNode(obj,typ,pos) {
  var o=$get(obj);  if (!o)  return;  // objeto inválido
  try {
    var t=$String($Defined(typ)?typ:o.nodeName).trim().toUpperCase();  // padrão é procurar pelo "nodeName" igual ao do OBJ informado
    var n=0,p=$Integer(pos),first=$findChildNode(o,p,t);
    while (first) {
      if ((++n)==p) return first;  // ... e procura pelo enésimo objeto
      first=first.nextSibling;
    }
  }catch(e){}
};
//
$Dat.$menuDelay={
  delay:new Array(),
  exec:new Array(),
  turn:new Array(),
  thread:new Array()
};
// Configura os Menus criados com DIV:
function $menuLimparThread() {
  for (var $data=$Dat.$menuDelay,thr=$data.thread,pos=0,len=thr.length; pos<len; pos++) {
    if (thr[pos])  $clear(thr[pos]);
    thr[pos]=null;
    $data.exec[pos]=null;
    $data.turn[pos]=0;
  }
};
function $menuAfterDelay(n) {
  var $data=$Dat.$menuDelay,thr=$data.thread,tmp='';  if (!$isNatural(n) || n>=thr.length) return;
  $clear(thr[n]);
  if ($isFunction($data.exec[n]))  tmp='($Dat.$menuDelay.exec['+n+'])()';
  if ($isString($data.exec[n]))  tmp='$Dat.$menuDelay.exec['+n+']';
  try  {
    eval(tmp);
    $menuLimparThread();
    return;
  }catch(e){}
  if (!$isNatural($data.turn[n]))  $data.turn[n]=0;
  if (!$isInteger($data.delay[n]))  $data.delay[n]=100;
  if ((++$data.turn[n])<10)  thr[n]=setTimeout('$menuAfterDelay('+n+')',$data.delay[n]);
};
// Função para animar um atributo de estilo:
function $menuDelay(wait,exec) {
  wait=$Integer(wait,50);  if (wait>3000) wait=3000;
  var $data=$Dat.$menuDelay,pos=$freeFromArray($data.thread);
  $data.delay[pos]=wait;
  $data.exec[pos]=exec;
  $data.turn[pos]=0;
  $data.thread[pos]=setTimeout('$menuAfterDelay('+pos+')',wait);
} ;
// Controle dos Submenus:
function $menuOcultar() {
  for (var num=1,subm; (subm=$get('subm'+num)); num++)  $hide(subm);
};
function $menuExibir(subm) {
  $show(subm=$String(subm));  // exibe o menu solicitado
  for (var pos=1,o; o=$get('subm'+pos); pos++) {
    if (o.id!=subm)  $hide(o);  // oculta os demais menus
  }
};
//
// Controle dos atributos de um objeto:
function $extend() {
  var target=(arguments[0] || {}),ini=1,len=arguments.length,deep=false,options,name,src,copy;
  // Handle a deep copy situation (if first argument == true):
  if ($isBoolean(target)) {
    deep=target;
    target=(arguments[ini++] || {});  // (ini++) => skip the boolean and the target
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (!$isObject(target) && !$isFunction(target))  target={};
  // extend Core itself if only one argument is passed
  if (len==ini) {
    target=this;
    ini--;
  }
  // Start the extend:
  for (var i=ini; i<len; i++) {
    options=arguments[i];  if (options==null)  continue;  // Only deal with non-null/undefined values
    // Extend the base object:
    for (name in options) {
      src=target[name];
      copy=options[name];
      if (target===copy)  continue;  // Prevent never-ending loop
      // Recursive, if we're merging object literal values or arrays:
      if (deep && copy && ($isPlainObject(copy) || $isArray(copy)) ) {
        var clone=(src && (($isPlainObject(src) || $isArray(src)) ? src : ($isArray(copy) ? [] : {}) ));
        // Never move original objects, clone them
        target[name]=$extend(deep,clone,copy);
      // Don't bring in undefined values
      } else if (copy!==undefined) {
        target[name]=copy;
      }
    }
  }
  // Return the modified object
  return target;
};
//
// Para executar comandos antes de finalizar a carga da página:
var readyList=new Array(),readyDone=false;
function $onReady() {
  if ($Win.readyDone)  return;  // Make sure that the DOM is not loaded twice times
  // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443):
  if (!$Body)  return setTimeout($onReady, 40);
  $Win.readyDone=true;  // Remember that the DOM is already done
  for (var fn,i=0,len=readyList.length; i<len; i++) {
    fn=readyList[i];  if (fn) fn.call( $Doc );  // execute functions bound
  }
  readyList=null;  // realease memory
};
//
// Criptografia simples (mão dupla):
function $cripto(txt,antes,depois) {
  var i,l=txt.length,n,start,end,v=true,a=new Array(),quant=0,MIN=33,MAX=207;
  antes=($Natural(antes)%MAX);  depois=($Natural(depois)%MAX);
  while (v) {
    if (quant>15) {
      quant=0;  antes--;  if (antes<1)  return '>><<';
    }
    start=MIN+(antes?antes:$rand(MAX));  end=(depois?depois:start);
    while (end==start)  end=MIN+$rand(MAX);  // para evitar repetir caracteres de controle
    // Para acelerar o processo:
    i=0;  while (i<l) { a[i]=txt.charCodeAt(i);  i++; }
    i=1;  while (i<l) { a[i]=(a[i]^a[i-1]^(((start*a[i-1])%255)+1));  i++; }  // primeira iteração
    n=l-2;  while (n>=0) { a[n]=(a[n]^a[n+1]^(((end*a[n+1])%255)+1));  n--; }  // segunda iteração
    // Confere se a resposta é válida:
    i=0;  v=false;
    while (i<l) {
      if (a[i]<32 || a[i]==34 || a[i]==39) {  // inválidos: Backspace, TAB, ENTER, ESC, "(34) e '(39)
        v=true;  break;
      }
      i++;
    }
    quant++;
  }
  // Monta a resposta:
  var resp='';  i=0;  while (i<l) { resp+=String.fromCharCode(a[i]); i++; }
  return String.fromCharCode(start)+resp+String.fromCharCode(end);
};
// Decriptografia simples (mão dupla):
function $decripto(txt) {
  var resp='',i,l=(txt=txt.trim()).length,n,a=new Array(),MIN=33,MAX=207;  if (l<2) return '';
  var start=txt.charCodeAt(0),end=txt.charCodeAt(l-1); if (start<MIN || start>(MIN+MAX) || end<MIN || end>(MIN+MAX))  return txt;
  txt=txt.substr(1,l-2);  l-=2;
  // Para acelerar o processo:
  i=0;  while (i<l) { a[i]=txt.charCodeAt(i);  i++; }  // cópia (retira o primeiro controle)
  n=0;  while (n<(l-1)) { a[n]=(a[n]^a[n+1]^(((end*a[n+1])%255)+1)); n++; }  // segunda iteração
  i=l-1;  while (i>0) { a[i]=(a[i]^a[i-1]^(((start*a[i-1])%255)+1)); i--; }  // primeira iteração
  // Converte para caracter:
  i=0;  while (i<l) { resp+=String.fromCharCode(a[i]); i++; }
  return resp;
};
// Captura a posição do cursor dentro de uma textbox:
function $getCaretPos(o) {
  var iCaretPos = 0;
  if ($Doc.selection) {  // IE Support
    o.focus();  // Set focus on the element
    // To get cursor position, get empty selection range
    var oSel=$Doc.selection.createRange();
    // Move selection start to 0 position
    oSel.moveStart('character', -$getVal(o).length);
    // The caret position is selection length
    iCaretPos=$getTxt(oSel).length;
  } else if (o.selectionStart || o.selectionStart == '0') // Firefox support
    iCaretPos=o.selectionStart;
  return (iCaretPos);
};
//
// Para controle de alterações/gravação de dados de uma <SELECT>...</SELECT>:
$Dat.$capturarSelect={
  obj:null,
  inicial:-1,
  object:null,
  controle:-1
};
function $capturarSelectValor(o) {
  var $data=$Dat.$capturarSelect;
  $data.obj=$get(o);  // objeto
  $data.inicial=($isObject($data.obj) ? $getSelVal($data.obj) : -1);
};
function $confirmarSelectValor(o) {
  var $data=$Dat.$capturarSelect;
  $data.object=$get(o);  // objeto
  $data.controle=$getSelVal($data.object);
  return ($data.controle==$data.inicial);
};
function $limparSelectValor() {
  var $data=$Dat.$capturarSelect;
  $data.obj=null;  // limpa o objeto
  $data.inicial='';
  $data.object=null;
  $data.controle='';
};
//
// Para controle de alterações/gravação de dados de uma <INPUT>...</INPUT>:
$Dat.$capturarInput={
  obj:null,
  inicial:'',
  object:null,
  controle:''
};
function $capturarInputValor(o) {
  var $data=$Dat.$capturarInput;
  $data.obj=$get(o);  // objeto
  $data.inicial=($isObject($data.obj) ? $getVal(o) : '')
};
function $confirmarInputValor(o) {
  var $data=$Dat.$capturarInput;
  $data.object=$get(o);
  $data.controle=$getVal(o);
  return ($data.controle==$data.inicial);
};
function $limparInputValor() {
  var $data=$Dat.$capturarInput;
  $data.obj=null;  // limpa o objeto
  $data.inicial='';
  $data.object=null;
  $data.controle='';
};
//
// Marca uma Radio Box:
function $opcaoEmNegrito(o) {
  o=$get(o);  if (!o) return 0;
  var form=$String(o.name),count=0;
  for (var i=0,tags=$getRadioList(form),max=tags.length,valor,estilo,tag; i<max; i++) {
    tag=tags[i];
    valor=$getVal(tag).trim();  if (valor=='')  continue;  // ERRO
    estilo=$style(form+''+valor);  // "id" é "case sensitive"
    if (estilo) {
      estilo.fontWeight=(tag==o ? 'bold' : 'normal');
      estilo.color=(tag==o ? 'red' : null);
    }
    count++;
  }
  return count;
};
//
// Para retirar o negrito de uma RadioBox selecionada:
function $opcoesEmNormal(form,mark) {
  mark=$get(mark);  if ($isEmpty(form))  return 0;
  var count=0;  // Desmarca TODAS as RadioBox do formulário:
  for (var i=0,tags=$getRadioList(form),max=tags.length,valor,estilo; i<max; i++) {
    valor=$getVal(tags[i]);  if ($isEmpty(valor)) valor=i;
    estilo=$style(form+''+valor);  if (!mark) tags[i].checked=false;
    if (estilo) {
      estilo.fontWeight='normal';
      estilo.color=null;
    }
    count++;
  }
  // Verifica se deve marcar uma opção:
  if (mark) {
    $opcaoEmNegrito(mark);  if (mark.onclick) mark.onclick();  // executa a função do clique do mouse, se existente
  } else
    $setVal(form,'');
  return count;
};
function $opcoesEmNormalArray(form) {
  if ($isString(form))  form=form.split(',');
  var count=0;  if (!$isArray(form))  return;
  for (var l=0,len=form.length; l<len; l++)  count+=$opcoesEmNormal(form[l],null);
  return count;
};
//
// Para colocar em negrito uma opção de CheckBox selecionada:
function $marcacaoEmNegrito(o,cor) {
  o=$get(o);  if (!o) return;
  var nome=$String(o.name),valor=$getVal(o); if ($isEmpty(nome) || $isEmpty(valor)) return;
  if ($String(o.type).toUpperCase()!='CHECKBOX')  return;
  var estilo=$style(nome+''+valor);
  if (estilo) {
    estilo.fontWeight=(o.checked ? 'bold' : 'normal');
    estilo.color=(o.checked ? ($isEmpty(cor) ? 'red' : cor) : '');
  }
};
function $marcarEmNegrito(o) {
  $setCheck(o);
  $marcacaoEmNegrito(o);
};
function $marcadorSemDependencia() {
  if (!$isFunction($Win.$capturarInput)) {
    alert("--> Para o comando '$capturarInput' funcionar é\n   preciso carregar a biblioteca 'bibCad.js'.");
    return true;
  }
  return false;
};
function $marcacoesEmNormal(form,mark) {
  if ($marcadorSemDependencia() || $isEmpty(form))  return 0;
  if ($isString(mark))  mark=mark.split('|');
  if (!$isArray(mark))  mark=new Array();
  var lst=new Array();  // captura os valores extras, se houver
  for (var i=0,len=mark.length; i<len; i++) {
    lst[i]=$String(mark[i]).tokout(2,':');
    mark[i]=$String(mark[i]).tokout(1,':');
  }
  $setVal(form,'');  // $capturarInput(form) está na biblioteca "bibCad.js"
  var tags=$getCheckList(form),count=tags.length;
  for (var i=0,valor,estilo,pos; i<count; i++) {
    if (!(tags[i])) {
      alert('mEN => Formulário errado!');
      return 0;
    }
    if ($String(tags[i].type).toUpperCase()!='CHECKBOX')  continue;
    valor=$getVal(tags[i]);  if ($isEmpty(valor)) valor=i;
    estilo=$style(form+''+valor);
    if (estilo) {
      pos=mark.indexOf($String(tags[i].id) || $getVal(tags[i]) || ' ');
      if (pos>=0) {
        tags[i].checked=true;
        // Obs: nem toda opção tem complemento.
        $showRow(form+'_row');
        $setVal(form,lst[pos]);
      } else {
        tags[i].checked=false;
        $hide(form+'_row');
        $setVal(form,'');
      }
      $marcacaoEmNegrito(tags[i]);
    }
  }
  return count;
};
function $marcacoesEmNormalArray(form) {
  if ($isString(form))  form=form.split(',');
  if ($marcadorSemDependencia() || !$isArray(form))  return;
  var c=$capturarInput(form);
  for (var l=0,len=form.length; l<len; l++)  $marcacoesEmNormal(form[l],null,c);
  return c;
};
function $qtdMarcacoesEmNegrito(form,c) {
  if ($isEmpty(form) || $marcadorSemDependencia())  return 0;
  var qtd=0,count=($isInteger(c) ? c : $capturarInput(form));  // $capturarInput(form) está na biblioteca "bibCad.js"
  for (var i=0,tags=$Dat.$adicionarCaptura.tudo; i<count; i++) {
    if (!(tags[i]))  return alert('qMEN => Formulário errado!');
    if ($String(tags[i].type).toUpperCase()!='CHECKBOX')  continue;
    if (tags[i].checked)  qtd++;
  }
  return qtd;
};
//
// Controle da cor de botões:
function $buttonEnable(o) {
  if (!$isObject(o=$get(o)))  return false;
  $backcolor(o,'yellow');  // para mudar a cor de fundo do botão
  $style(o).cursor='pointer';
  return true;
};
function $buttonDisable(o) {
  if (!$isObject(o=$get(o)))  return false;
  $backcolor(o,'darkgray');  // para mudar a cor de fundo do botão
  $style(o).cursor='default';
  return true;
};
$Tmp.$showPage={
  viewed:new Array(),
  inited:new Array(),
  loaded:new Array()
};
function $showPage(o) {
  o=$get(o);  if (!o) return;
  var form=$String(o.id).onlyNum(),page=$Natural($getVal(o));  if ($isEmpty(form) || page<1) return;
  form=Number(form);
  $Tmp.$showPage.viewed[form]=page;
  $buttonDisable('page'+form+'-but'+page);  // desabilita o botão que foi pressionado
  $buttonEnable('page'+form+'-button');  // habilita o botão TODAS
  for (var p=1,o; (o=$get('page'+form+'-'+p)); p++) {
    if (p!=page) {
      $hideRow(o);  // oculta todas as páginas ...
      $buttonEnable('page'+form+'-but'+p); // ... habilita o botão de exibição ...
    }
  }
  $showRow('page'+form+'-'+page);  // ... e exibe só a página solicitada
};
function $showPages(o) {
  o=$get(o);  if (!o) return;
  var id=$String(o.id).onlyNum(),form=$Natural(id);  if ($isEmpty(id) || form < 1) return;
  $Tmp.$showPage.viewed[form]=0;  // TODAS
  if ($buttonDisable('page'+form+'-button')) {  // desabilita o botão TODAS (que foi pressionado)
    for (var p=1,o,p; (o=$get('page'+form+'-'+p)); p++) {  // TODAS as páginas ...
      $showRow(o);  // ... mostra a página ...
      $buttonEnable('page'+form+'-but'+p);  // ... e habilita o botão correspondente.
    }
  }
};
//
// Inicializa as variáveis de controle da paginação:
function $page2Init(form,page) {
  if (!$isArray($Tmp.$showPage.loaded[form]))  $Tmp.$showPage.loaded[form]=new Array();
  if (!($Tmp.$showPage.loaded[form][page]))  $Tmp.$showPage.loaded[form][page]=false;
};
// Para verificar se uma determinada página já foi carregada:
function $isPage2Loaded(form,page) {
  var p=$Natural(page);  if (p<1)  return;
  if (!($isFormLoaded(form)))  return false;
  $page2Init(form,page);  // Inicializa as variáveis de controle
  var html=$getHtml('page'+form+'-'+p).substr(0,110).toLowerCase().trim();
  var posClass=html.indexOf(' class="atualizando"'),posLoad=html.indexOf('a ser atualizada ...');
  return (posClass<0 && posLoad<0);
};
// Para carregar formulários com páginas:
function $showPage2_update(form,page) {
  if (form<1||page<1)  return;
  for (var p=1,o; (o=$get('page'+form+'-'+p)); p++) {
    if (p!=page) {
      $hideRow(o);  // oculta todas as páginas ...
      $buttonEnable('page'+form+'-but'+p); // ... habilita o botão de exibição ...
    }
  }
  $showRow('page'+form+'-'+page);  // ... e exibe só a página solicitada
};
function $showPage2_setHtml(rsp) {
  rsp=$String(rsp);
  var top=rsp.tokout(1,'^'),f=top.tokin(2,$Def.numeral),p=top.tokin(3,$Def.numeral);
  if (f<1||p<1)  return $alert('>>$sPa2_r: erro no dado recebido (Top="'+top+'").');
  var html=rsp.substr(top.length+1);
  if ($isEmpty(html)) {
    $page2Init(f,p);  // Inicializa as variáveis de controle
    $Tmp.$showPage.loaded[f][p]=false;  // para permitir tentar carregar
    html='>> Nada foi recebido!';
  }
  if (top.left(5)!='==(4)') {
    $page2Init(f,p);  // Inicializa as variáveis de controle
    $Tmp.$showPage.loaded[f][p]=false;  // para permitir tentar carregar
    html='>> Conteúdo inválido: '+html;
  }
  $setHtml('page'+f+'-'+p,html);  // Escreve o conteúdo recebido
}
function $showPage2_response(rsp) {
  $showPage2_setHtml(rsp);
  $hide('aguardar');
  $hide('form9999');
};
// Verifica se a página desejada já foi carregada:
function $showPage2_load(form,page,extra,callback) {
  if (form<1 || page<1 || $isPage2Loaded(form,page)) return;
  if (!($Tmp.$showPage.loaded[form][page])) {
    $Tmp.$showPage.loaded[form][page]=true;  // para não enviar o pedido de carregamento da página mais de uma vez
    $show('aguardar');
    var cb=($isFunction(callback)?callback:$Win.$showPage2_response);
    extra=$String(extra);
    $Send('form'+form+'_tad.php','page='+page+($isEmpty(extra)?'':'&')+extra,cb);
  }
};
function $showPage2(o,extra) {
  o=$get(o);  if (!o) return;
  var id=$String(o.id).onlyNum(),page=Number($getVal(o)),form=Number(id);  if ($isEmpty(id) || page<1 || form<1) return;
  $Tmp.$showPage.viewed[form]=page;
  $buttonDisable('page'+form+'-but'+page);  // desabilita o botão que foi pressionado
  $buttonEnable('page'+form+'-button');  // habilita o botão TODAS
  $showPage2_load(form,page,extra)
  $showPage2_update(form,page);
};
// Informa qual é a página que está sendo visualizada:
function $getViewedPage(form) {
  var f=$Natural($String(form).tokin(1,$Def.numeral)),pg=$Tmp.$showPage.viewed[f];  if (!$isNumber(pg)) $Tmp.$showPage.viewed[f]=pg=-1;
  return pg;
};
// Trata o teclado:
$Cnf.myNav={
 lines:new Array(),
 cols:new Array()
}
function $moveToUp(side,pos) {
  if (!$isNatural(side) || !$isNatural(pos)) return;
  if (pos)  pos--;
  return $String($Cnf.myNav.lines[side][pos]);
};
function $moveToDown(side,pos) {
  if (!$isNatural(side) || !$isNatural(pos)) return;
  var max=$Cnf.myNav.lines[side].length-1;  if (pos<max)  pos++;
  return $String($Cnf.myNav.lines[side][pos]);
};
function $moveToLeft(side,pos) {
  if (!$isNatural(side) || !$isNatural(pos)) return;
  if (pos)  pos--;
  return $String($Cnf.myNav.cols[side][pos]);
};
function $moveToRight(side,pos) {
  if (!$isNatural(side) || !$isNatural(pos)) return;
  var max=$Cnf.myNav.cols[side].length-1;  if (pos<max)  pos++;
  return $String($Cnf.myNav.cols[side][pos]);
};
function $myNavKey(e,dir,side,num) {  // e == window.Event
  var obj;
  e=(e ? e : $Win.Event);
  switch (e.keyCode) {  // keyCode: é código da tecla, e não do caracter !!
    case 38: // UP
      if (!dir) {
        obj=$moveToUp(side,num);  if ($isEmpty(obj))  return;
        $get(obj).focus();
      }
      break;
    case 13: // ENTER
    case 40: // DOWN
      if (!dir) {
        obj=$moveToDown(side,num);  if ($isEmpty(obj))  return;
        $get(obj).focus();
      }
      break;
    case 37: // LEFT
      if (dir) {
        obj=$moveToLeft(side,num);  if ($isEmpty(obj))  return;
        $get(obj).focus();
      }
      break;
    case 39: // RIGHT
      if (dir) {
        obj=$moveToRight(side,num);  if ($isEmpty(obj))  return;
        $get(obj).focus();
      }
      break;
    case 16: // SHIFT
    case 17: // CTRL
      break;
  }
  return false;
};
// Controle de navegação com teclado (Up, Down, Left, Right):
function $navAdjust() {
  for (var l=0,m=$Cnf.myNav.lines.length;l<m;l++) {
    if ($isArray($Cnf.myNav.lines[l])) {
      for (var c=0,n=$Cnf.myNav.lines[l].length,obj;c<n;c++) {
        obj=$get($Cnf.myNav.lines[l][c]);  //if (!obj) continue;
        $addEvent(obj,'keyup',Function('evt','$myNavKey(evt,0,'+l+','+c+')'));
      }
    }
  }
  for (var l=0,m=$Cnf.myNav.cols.length;l<m;l++) {
    if ($isArray($Cnf.myNav.cols[l])) {
      for (var c=0,n=$Cnf.myNav.cols[l].length,obj;c<n;c++) {
        obj=$get($Cnf.myNav.cols[l][c]);  //if (!obj) continue;
        $addEvent(obj,'keyup',Function('evt','$myNavKey(evt,1,'+l+','+c+')'));
      }
    }
  }
};
//
// Controle da exibição das opções disponíveis:
$Tmp.splash={
  timer:null,
  obj:'',
  over:false,
  onclick:'',
  key:'',
  nud:0  // número único de processo
}
function $splashCancel() {
  $clear($Tmp.splash.timer);
  $Tmp.splash.timer=null;
  $splashStop();
};
function $showSplashList(rsp,menos,sep) {
  $splashCancel();
  rsp=$String(rsp);  if (rsp.left(2)=='>>')  return alert('>>$sSL'+rsp);  // houve erro
  var nud=$getParam(rsp,'nud','^');  if (nud!=$Tmp.splash.nud)  return;  // texto descartado, pois há uma solicitação mais recente!!
  rsp=rsp.split('^');  if (rsp.length<1)  return;  // muitas opções (ou nenhuma!) ...
  var txt='',ssep=$String(sep);  if (!(ssep.length))  ssep=';;';
  for (var i=0,len=rsp.length,c,t;i<len;i++) {
    c=$getParam(rsp[i],'cmd',ssep);
    t=$getParam(rsp[i],'txt',ssep);
    if ($notEmpty(t)) {
      txt+='<div onmouseover="$splashOver();" onmouseout="$splashOut();"';
      txt+=' style="padding:1px 16px 0px 2px;cursor:pointer;" onclick="$splashCancel();'+c+'">'+t+'</div>';
    }
  }
  if ($isEmpty(txt)) return;  //  alert('>>$sSL: empty! (;;)?')
  var div=$splashCreate(txt),sty=$style(div),pos=$position($Tmp.splash.obj),menos=$roll($get(menos));
  sty.textAlign='left';
  sty.left=pos[0]-$Natural(menos[0]);
  sty.top=pos[1]-$Natural(menos[1])+24;
  sty.width=null;
  sty.height=null;
  $show(div);
  $Tmp.splash.timer=setTimeout('$splashStop();',8000);
};
// checksum - returns a checksum using the Adler-32 method:
function $checksum(t) {
  var a=1,b=0;
  for (var i=0,l=t.length;i<l;i++) {
    a=(a+t.charCodeAt(i))%65521;
    b=(b+a)%65521;
  }
  return (b<<16)|a;
};
//
// Função para mover objetos:
function $objMove(evt,obj,limits,cb) {  // limits={left:0,top:0,right:3840,bottom:2160};
  var sty=$style(obj),done=false;uHdWidth=3840,uHdHeight=2160;  if (!sty || obj==$Body)  return;  // não é possível mover o <BODY>
  var e=(evt?evt:$Win.Event),m=$mouse(e),x=m['posX']-$Integers(sty.left),y=m['posY']-$Integers(sty.top),res=$windowSize();  // "res" => resolução atual do monitor
  var limLeft=0,limRight=$Integer('<?PHP echo $_SESSION["myScrWidth"]; ?>',80,res.width||uHdWidth),pLeft,pTop;
  var limTop=0,limBottom=$Integer('<?PHP echo $_SESSION["myScrHeight"]; ?>',60,res.height||uHdHeight);
  // Verifica se foram informados novos limites:
  if (limits) {
    if ($isNumber(limits.left))  limLeft=limits.left;
    if ($isNumber(limits.top))   limTop=limits.top;
    if ($isNumber(limits.right)) limRight=limits.right;
    if ($isNumber(limits.bottom)) limBottom=limits.bottom;
  }
  // Armazena as configurações anteriores do <BODY>:
  var cursor=sty.cursor,bodyMove=$Body.onmousemove,bodyUp=$Body.onmouseup,bodySelStart=$Body.onselectstart,bodySelect=$Body.onselect;
  // Libera o evento do objeto (release) e restaura as configurações anteriores:
  obj.onmouseup=function(evt){
    obj.onmousemove=null;  // APAGA o "engage" que havia sido configurado
    $Body.onmousemove=bodyMove;  // restaura a configuração do <BODY>, evitando erros!!
    $Body.onmouseup=bodyUp;
    $Body.onselectstart=bodySelStart;
    $Body.onselect=bodySelect;
    sty.cursor=cursor;  // restaura o cursor
    $cancelEvt(evt);
    if ($isFunction(cb))  cb(done,pLeft,pTop);
  };
  // Captura o evento do objeto (engage):
  obj.onmousemove=function(evt){
    done=true;
    var p=$mouse(evt),pLeft=p['posX']-x,pTop=p['posY']-y;  if (pLeft<limLeft)  pLeft=limLeft;
    if (pLeft>limRight)  pLeft=limRight;
    sty.cursor='move';  if (pTop<limTop)  pTop=limTop;
    if (pTop>limBottom)  pTop=limBottom;
    sty.left=pLeft+'px';
    sty.top=pTop+'px';
    $cancelEvt(evt);
  };
  obj.onselect=function(evt){
    $cancelEvt(evt);
    return false;
  };
  // MUITO IMPORTANTE, porque movimentos rápidos do mouse retiram o foco de dentro do objeto e recaem sobre o <BODY>, causando erro:
  $Body.onmousemove=obj.onmousemove;
  $Body.onmouseup=obj.onmouseup;
  $Body.onselectstart=obj.onselect;
  $Body.onselect=obj.onselect;
  if (done)  $cancelEvt(e);
  return done;
};
//
// Alternância de funções (usada pelo $alternate):
$Dat.$slice={
  func:new Array(),
  pos:new Array(),
  cicles:new Array(),
  speed:new Array(),
  thread:new Array()
};
function $slicInvalid(n) { return (!$isNatural(n) || !$isArray($Dat.$slice.func[n])) };
function $slicClear(n) {
  var data=$Dat.$slice;  if ($slicInvalid(n)) return true;
  $clear(data.thread[n]);
  data.func[n]=null;
  return false;
};
function $slicCancel(n) {
  if ($slicClear(n))  return false;  // pára a thread ("false" => inválida. Logo, não estava em execução)!
  var data=$Dat.$slice,done=(data.cicles[n]>0);
  data.cicles[n]=0;  // LIMPA
  return done;  // informa se estava em execução
};
function $slice(n) {
  var $data=$Dat.$slice;  if ($slicInvalid(n)) return;
  $clear($data.thread[n]);  // limpa (e pára) a execução da thread, SFC
  try{  // é necessário ficar!!
    if ($isString($data.func[n][$data.pos[n]]))  $data.func[n][$data.pos[n]]=eval($data.func[n][$data.pos[n]]);
    var tmp='($Dat.$slice.func['+n+']['+$data.pos[n]+'])('+n+')';
    eval(tmp);  // executa a função
  }catch(e){}  // se ocorrer erro, prossegue!!
  $data.pos[n]++;
  if ($data.pos[n]>=$data.func[n].length) {
    $data.pos[n]=0;
    $data.cicles[n]--;  // decrementa o contador de ciclos a serem executados
    if ($data.cicles[n]<1)  return $slicClear(n);  // verifica se encerrou!!
  }
  $data.thread[n]=setTimeout('$slice('+n+')',$data.speed[n]);
};
function $slicStart(f,cicles,speed) {
  if ($isString(f))  f=f.split(',');
  var $data=$Dat.$slice,n=$freeFromArray($data.func);  if (!$isArray(f)) return -1;
  $data.func[n]=f;  // lista de funções (array)
  $data.pos[n]=0;  // função que atualmente está sendo executada
  $data.cicles[n]=$Integer(cicles);  // quantidade de vezes que irá alternar
  $data.speed[n]=$Integer(speed,20);  // tempo entre execuções (velocidade)
  $data.thread[n]=setTimeout('$slice('+n+')',20);  // "20" => início imediato
  return n;  // retorna o número de cadastro
};
// Função para animar a execução de funções:
function $alternate(f,cicles,speed) { return $slicStart(f,cicles,speed) };
//
// Para centralizar objetos:
$Def.$centralizar={
  obj:new Array(),
  ref:new Array(),
  running:new Array()
}
function $centralizar(obj,ref,noScroll) {  // "ref" => é objeto do qual se deve capturar a posição e ajudará a centralizar o objeto "obj"
  var o=$get(obj),r=$get(ref),sty=$style(o),c=$Def.$centralizar,n=c.obj.length;  if (!sty)  return;
  c.running[n]=true;  // em execução ...
  var x=4,y=3,w=$position(r||o),offX=w[0],offY=w[1],res=$windowSize(),roll=$roll(r||o),rW=roll[0],rY=roll[1];  // "res" => resolução da janela;
  var scr=$screenSize(),resX=(scr.width||res.width||320),resY=(scr.height||res.height||240);  // "scr" => resolução do monitor
  // Centraliza o objeto:
  if (resX>=320) {
    x=((resX-$Natural(sty.width))>>1)-offX+rW;  if (x<4)  x=4;
    y=((resY-$Natural(sty.height))>>1)-offY+rY;  if(y<3)  y=3;
  }
  sty.position='absolute';
  sty.left=x+'px';
  sty.top=y+'px';
  if (ref && !(noScroll)) {
    c.obj[n]=o;
    c.ref[n]=r;
    $addEvent(ref,'scroll', Function('','$centralAuto('+n+')'));
  }
  c.running[n]=false;  // ... acabou a execução.
};
function $centralAuto(num) {
  var c=$Def.$centralizar,n=$Natural(num);  if (c.running[n])  return setTimeout('$centralAuto('+n+')',10);
  if ($isObject(c.obj[n]))  $centralizar(c.obj[n],c.ref[n],true);
};
//
// HTML5 Storage: Armazenando dados com HTML5 "http://www.devmedia.com.br/html5-storage-armazenando-dados-com-html5/28797#ixzz3eS9jmkc7"
// Para armazenar valores na SESSÃO de trabalho do navegador (dados são perdidos ao mudar/fechar a página acessada):
function $setSessionKey(k,v) {
  if ($isEmpty(k))  return '';  // chave inválida!
  var prev=$getKey(k);  if (!prev)  prev='';  // NÃO havia nada armazenado.
  sessionStorage.setItem(k,$String(v));  // armazena
  return prev;  // retorna o valor armazenado anteriormente.
};
function $getSessionKey(k) { sessionStorage.getItem($isEmpty(k)?'':k) };  // retorna o valor armazenado (se k=='' => a chave é inválida).
// Para armazenar valores no LOCAL de trabalho do navegador (dados são persistentes, e método substitui o uso de COOKIE):
function $setLocalKey(k,v) {
  if ($isEmpty(k))  return '';  // chave inválida!
  var prev=$getKey(k);  if (!prev)  prev='';  // NÃO havia nada armazenado.
  localStorage.setItem(k,$String(v));  // armazena
  return prev;  // retorna o valor armazenado anteriormente.
};
function $getLocalKey(k) { localStorage.getItem($isEmpty(k)?'':k) };  // retorna o valor armazenado (se k=='' => a chave é inválida).
//
// Cleanup functions for the document ready method
var DOMContentLoaded=null;
// Acrescenta funções, a serem executadas depois do Ready() do sistema:
$Cnf.scriptEval=false;
// Carrega após o início da página:
var onloadPre=0,preload=$Win.onload;
$Win.onload=function() {
  // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
  $Body=$Doc.body;  if (!$Body)  return setTimeout( $Win.onload, 40 );
  // Captura ou cria a TAG <html>:
  $Html=($getByTag('html')[0] || $Body.parentNode || $Doc.documentElement);
  // Captura ou cria a TAG <head>:
  $Head=($getByTag('head')[0] || $Html.appendChild($Doc.createElement('head')) || $Doc.documentElement);
  //
  $addEvent($Win,'Error',$showError);
  // TESTES
  //  alert($measure('rogerio',16).width);  // Resp: 43
  //  alert($makeFit('rogerio',30,null).size);  // Resp: 10.4
  //  alert($Doc.cookie);
  //  alert($dec2Hex(23));
  //  alert($inverterData('03-12-1970'));
  //  $exibirJanela('nubooo');
  //  $criarJanela('nubooo');
  // Teste da Criptografia:
  /*
  var texto=$cripto('rogerio'),t='(',i=0,l=texto.length;
  for(var i=0;i<l;i++) { t+=(i+'='+texto.charCodeAt(i)+';');  i++; }
  alert("Crypto:\n"+texto+"\n"+t+')');
  alert("Decrypto:\n"+$decripto(texto));
  */
  //
  // Corrige BUG de transparências no IE:
  $fixPNG();
  //
  // $delEvent($Win,'Load',$onReady);
  $onReady();
  Biblio['biblio']='20180719v2.71';
  if (!$Win.onloadPre) {
    $Win.onloadPre++;
    if ($isFunction(preload))  preload();  // executa, caso o evento 'onload' já tenha sido configurado
  }
};
// -->