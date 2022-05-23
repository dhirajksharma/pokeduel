// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
}
const container=document.querySelector('#container');
for(let i=1;i<150;i++)
{
    const newImg=document.createElement('img');
    newImg.src=`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pad(i,3)}.png`;
    newImg.classList.add("pokemons");
    newImg.style.backgroundColor='white';
    container.append(newImg);
}

const pokemons=document.querySelectorAll('#container img');
let count=0;
for(let pokemon of pokemons)
{
    pokemon.addEventListener('click', function addpokemon(e) {
        const newImg=document.createElement('img');
        console.log(pokemon);
        newImg.src=e.target.attributes.src.textContent;
        newImg.classList.add('playpoke');
        const player1=document.querySelector('#player1');
        const player2=document.querySelector('#player2');
        if(count==0)
        {
            e.target.style.backgroundColor='#abf5f7';
            e.target.classList.add('selected');
            player1.appendChild(newImg);
            count+=1;
        }
        else if(count==1)
        {
            e.target.style.backgroundColor='#abf5f7';
            e.target.classList.add('selected');
            player2.appendChild(newImg);
            const banner=document.querySelector('h3');
            banner.innerHTML='The Duel Begins';
            const winner=Math.random() <0.5?1:2;
            banner.innerHTML=`Player ${winner} wins`;
            count+=1;
            const rest=document.querySelector('button');
            rest.style.display='inline-block';
        }
    }
    );
}

const rest=document.querySelector('button');
rest.addEventListener('click', function (e){
    const players=document.querySelectorAll('.playpoke');
    for(let poke of players)
    {
        poke.remove();
    }
    for(let poke of document.querySelectorAll('.selected'))
    {
        poke.style.backgroundColor='white';
    }
    const banner=document.querySelector('h3');
    banner.innerHTML='Select Your Pokemons';
    const played=document.querySelectorAll('.selected');
    for(let poke of played)
    {
        poke.classList.remove('selected');
    }
    count=0;
    rest.style.display='none';
});
