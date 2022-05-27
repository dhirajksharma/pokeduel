const banner=document.querySelector('h3');
const operatebutton=document.querySelector('#operate');
let count=0;
let player1pokemonid;
let player2pokemonid;
const player1=document.querySelector('#player1');
const player2=document.querySelector('#player2');
const pokemondeck=document.querySelector('#deck');

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


function pokemonAssign(img,player)
{
    let id=img.id;
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
         movelist.setAttribute('id', `movesofpokemon${id}`);
         player.appendChild(movelist);
      })
      .catch(err => {
          alert("Unexpected Error! Please Refresh Page");
      })
}

const player1health=document.querySelector('#player1health');
const player2health=document.querySelector('#player2health');
let attackcount=0;
function attack(playerh,pbut,opbut)
{
    if(attackcount<=5)
    {
        
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
    const player1movelist=document.querySelector(`#movesofpokemon${player1pokemonid}`);
    const player2movelist=document.querySelector(`#movesofpokemon${player2pokemonid}`);
    player1movelist.style.display='flex';
    player2movelist.style.display='flex';
    player1health.style.display='block';
    player2health.style.display='block';
    document.querySelectorAll('.hbar')[0].style.display='block';
    document.querySelectorAll('.hbar')[1].style.display='block';
    player1health.alt=100;
    player2health.alt=100;
}

function duel()
{
    assignmoves();
    banner.innerHTML='The Duel Begins';
    const p1but=document.querySelectorAll('#player1 button');
    const p2but=document.querySelectorAll('#player2 button');

    for(let button of p1but)
    {
        button.addEventListener('click',function(){
            attack(player2health,p1but,p2but);
        });
    }

    for(let button of p2but)
    {
        button.addEventListener('click',function(){
            attack(player1health,p2but,p1but);
        });
    }
    operatebutton.removeEventListener('click',duel);
}
function declarewinner(p1h,p2h)
{
    if(parseInt(p1h)>parseInt(p2h))
        banner.innerHTML='Player 1 wins';
    else if(parseInt(p1h)<parseInt(p2h))
        banner.innerHTML='Player 2 wins';
    else
        banner.innerHTML='Draw';
    operatebutton.innerHTML='Reset';
    operatebutton.addEventListener('click',reset);
}

function reset()
{
    attackcount=0;
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
            operatebutton.innerHTML='Begin'
            operatebutton.style.display='inline-block';
            operatebutton.addEventListener('click',duel);
        }
    }
    );
}