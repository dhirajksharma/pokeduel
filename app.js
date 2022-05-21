// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png

const container=document.querySelector('#container');
for(let i=1;i<100;i++)
{
    const newImg=document.createElement('img');
    newImg.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
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
        newImg.classList.add("pokemons");
        const player1=document.querySelector('#player1');
        const player2=document.querySelector('#player2');
        if(count==0)
        {
            e.target.style.backgroundColor='#abf5f7';
            player1.appendChild(newImg);
            count+=1;
        }
        else if(count==1)
        {
            e.target.style.backgroundColor='#abf5f7';
            player2.appendChild(newImg);
            const banner=document.querySelector('h3');
            banner.innerHTML='The Duel Begins';
            const winner=Math.random() <0.5?1:2;
            banner.innerHTML=`Player ${winner} wins`;
            count+=1;
        }
    }
    );
}