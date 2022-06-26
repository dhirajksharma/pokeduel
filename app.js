const banner=document.querySelector('h3');
const operatebutton=document.querySelector('#operate');
let count=0;
let player1pokemonid;
let player2pokemonid;
const player1=document.querySelector('#player1');
const player2=document.querySelector('#player2');
const pokemondeck=document.querySelector('#deck');
const winm=document.querySelector('#winmusic');
const atkm=document.querySelector('#attackmusic');
const info=document.querySelector("#info");
const ovr=document.querySelector('#overlay');
const inf=document.querySelector('#infodiv');
inf.addEventListener('click',function(e){
    e.stopPropagation();
})

info.addEventListener('click',function(){
    ovr.style.display='block';
    document.querySelector('body').style.overflow='hidden';
    ovr.addEventListener('click',function(){
        ovr.style.display='none';
        document.querySelector('body').style.overflow='auto';
    })
})



const dnswitch=document.querySelector("#daynightswitch");
const r=document.querySelector(":root");

dnswitch.addEventListener('click',function(){
    if(dnswitch.getAttribute('alt')==="day")
    {
        r.style.setProperty('--bodycolor','#39393c');
        r.style.setProperty('--fontcolor','#ffffff');
        r.style.setProperty('--footercolor','#fefefe');
        r.style.setProperty('--linkcolor','yellow');
        r.style.setProperty('--operateborder','#fbc115');
        r.style.setProperty('--operateborderhover','#fce82a');
        dnswitch.setAttribute('src','res/sun.png');
        dnswitch.setAttribute('alt','night');
    }
    else
    {
        r.style.setProperty('--bodycolor','#ffffff');
        r.style.setProperty('--fontcolor','#000000');
        r.style.setProperty('--footercolor','#rgb(82, 76, 76)');
        r.style.setProperty('--linkcolor','rgb(64, 64, 180)');
        r.style.setProperty('--operateborder','rgb(197, 95, 11)');
        r.style.setProperty('--operateborderhover','rgb(243, 37, 10)');
        dnswitch.setAttribute('src','res/moon.png');
        dnswitch.setAttribute('alt','day');
    }
})


//functions

function seqencegenerator(length,max)
{
    let seq=[];
    while(seq.length<length)
    {
        let num=Math.floor(Math.random()*max)+1
        if(seq.indexOf(num)==-1)
            seq.push(num);
    }
    return seq;
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
}

let temp="";
let poke1moveid="notyetassigned";
let poke2moveid="notyetassigned";
function pokemonAssign(img,player)
{
    let id=(img.id==="selected")?temp:img.id;
    let tep=`movesofpokemon${id+temp}`;
    temp=id;
    const newImg=document.createElement('img');
    newImg.src=img.src;
    newImg.classList.add('onboard');
    img.setAttribute('id','selected');
    player.appendChild(newImg);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then(res => {
        const nameofpokemon=document.createElement('h2');
        nameofpokemon.classList.add('onboard');
        nameofpokemon.innerHTML=res.data.name;
        player.appendChild(nameofpokemon);
         const movelist=document.createElement('ul');
             for(let i of seqencegenerator(5,10))
             {
                 const mov=document.createElement('li');
                 const movehit=document.createElement('button');
                 movehit.innerHTML=res.data.moves[i].move.name;
                 mov.append(movehit);
                 movehit.classList.add('moves');
                 movelist.append(mov);
             }
         movelist.style.display='none';
         movelist.classList.add('onboard');
         movelist.setAttribute('id', tep);
         player.appendChild(movelist);
         if(poke1moveid==="notyetassigned")
             poke1moveid=tep;
         else
             poke2moveid=tep;
      })
      .catch(err => {
          alert("Unexpected Error! Please Refresh Page");
      })
}

const player1health=document.querySelector('#player1health');
const player2health=document.querySelector('#player2health');
let attackcount=0;
function attack(playerh,pbut,opbut,n)
{
    if(attackcount<=5)
    {
        atkm.play();
        let curval=parseInt(playerh.alt);
        let rand=Math.floor(Math.random()*25);
        rand=rand>10?rand:rand+5;
        playerh.style.width=`${curval-rand}%`
        playerh.alt=curval-rand;
        for(let button of pbut)
        {
            button.disabled=true;
        }
        for(let button of opbut)
        {
            button.disabled=false;
        }
        attackcount+=1;
        banner.innerHTML=`Player ${n} attack`;
        let p1h=parseInt(player1health.alt);
        let p2h=parseInt(player2health.alt);
        if(attackcount==6 || p1h==0 || p2h==0)
        {
            for(let button of opbut)
            {
                button.disabled=true;
            }
            declarewinner(p1h,p2h);
        }
    }
}

function assignmoves()
{
    
    try{
    const player1movelist=document.querySelector(`#${poke1moveid}`);
    const player2movelist=document.querySelector(`#${poke2moveid}`);
    player1movelist.style.display='flex';
    player2movelist.style.display='flex';
    player1health.style.display='block';
    player2health.style.display='block';
    document.querySelectorAll('.hbar')[0].style.display='block';
    document.querySelectorAll('.hbar')[1].style.display='block';
    player1health.alt=100;
    player2health.alt=100;}
    catch{
        alert("Unexpected Error! Please refresh page");
    }
}

function duel()
{
    assignmoves();
    banner.innerHTML='The Duel Begins';
    operatebutton.innerHTML='Reset';
    operatebutton.addEventListener('click',reset);
    const p1but=document.querySelectorAll('#player1 button');
    const p2but=document.querySelectorAll('#player2 button');

    for(let button of p1but)
    {
        button.addEventListener('click',function(){
            attack(player2health,p1but,p2but,2);
        });
    }

    for(let button of p2but)
    {
        button.addEventListener('click',function(){
            attack(player1health,p2but,p1but,1);
        });
    }
    operatebutton.removeEventListener('click',duel);
}
function declarewinner(p1h,p2h)
{
    winm.play();
    if(parseInt(p1h)>parseInt(p2h))
        banner.innerHTML='Player 1 wins';
    else if(parseInt(p1h)<parseInt(p2h))
        banner.innerHTML='Player 2 wins';
    else
        banner.innerHTML='Draw';
    // operatebutton.innerHTML='Reset';
    // operatebutton.addEventListener('click',reset);
}

function reset()
{
    attackcount=0;
    poke1moveid="notyetassigned";
    poke2moveid="notyetassigned";
    temp="";
    player1health.style.display='none';
    player2health.style.display='none';
    document.querySelectorAll('.hbar')[0].style.display='none';
    document.querySelectorAll('.hbar')[1].style.display='none';
    player1health.alt='100';
    player2health.alt='100';
    player1health.style.width='100%'
    player2health.style.width='100%'
        const players=document.querySelectorAll('.onboard');
        for(let poke of players)
        {
            poke.remove();
        }
        
        banner.innerHTML='Select Your Pokemons';
        const played=document.querySelectorAll('#selected');
        for(let poke of played)
        {   
            poke.id=parseInt(poke.src.substr(76,78));
        }
        count=0;
        operatebutton.style.display='none';
        operatebutton.removeEventListener('click',reset);
}

for(let i of seqencegenerator(100,800))
{
    const newImg=document.createElement('img');
    newImg.src=`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pad(i,3)}.png`;
    newImg.classList.add("pokemons");
    newImg.setAttribute('id',`${i}`);
    pokemondeck.append(newImg);
}

const pokemons=document.querySelectorAll('#deck img');
for(let pokemon of pokemons)
{
    pokemon.addEventListener('click', function(e) {
        if(count==0)
        {
            player1pokemonid=pokemon.id;
            pokemonAssign(pokemon,player1);
            count+=1;
        }
        else if(count==1)
        {
            player2pokemonid=pokemon.id;
            pokemonAssign(pokemon,player2);
            count+=1;
            window.scrollTo({top:0,behavior:"smooth"});
            setTimeout(function(){
            operatebutton.innerHTML='Begin'
            operatebutton.style.display='inline-block';
            operatebutton.addEventListener('click',duel);
            }, 1500);
        }
    }
    );
}