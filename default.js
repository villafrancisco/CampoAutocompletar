function autocompletar(){
    const inputMascota=document.querySelector('#tipo-mascota');
    let indexFocus=-1;
    inputMascota.addEventListener('input',function(){
        const tipoMascota=this.value;
        if(!tipoMascota) return false;

        cerrarLista();

        //crear la lista de sugerencias
        const divList=document.createElement('div');
        divList.setAttribute('id',this.id +'-lista-autocompletar');
        divList.setAttribute('class','lista-autocompletar-items');
        this.parentNode.appendChild(divList);
        
        //conexion a Base de datos
        httpRequest('https://jsonplaceholder.typicode.com/comments',function(){
            
            const listaElementos=JSON.parse(this.responseText);
            
             // validar el array con el input
            if(listaElementos.length==0) return false;
            listaElementos.forEach(item => {
                if(item.name.substr(0,tipoMascota.length)==tipoMascota){
                    const elementoLista=document.createElement('div');
                    elementoLista.innerHTML=`<strong>${item.name.substr(0,tipoMascota.length)}</strong>${item.name.substr(tipoMascota.length)}`;
                    elementoLista.addEventListener('click',function(){
                        inputMascota.value=this.innerText;
                        cerrarLista();

                    });
                    divList.appendChild(elementoLista);
                }
            });

        });

       
    });

    inputMascota.addEventListener('keydown',function(e){
        const divList=document.querySelector('#' + this.id + '-lista-autocompletar');
        let items;
        if(divList){
            items=divList.querySelectorAll('div');
            switch(e.keyCode){
                case 40: //tecla abajo
                    indexFocus++;
                    if(indexFocus > items.length-1)   indexFocus=items.length - 1;
                    break;
                case 38: //tecla arriba
                    indexFocus--;
                    if(indexFocus < 0) indexFocus=0;
                    break;
                case 13: //tecla enter
                    e.preventDefault();
                    items[indexFocus].click();
                    indexFocus=-1;
                    break;
                default:
                break;
            }

            seleccionar(items,indexFocus);
            return false;
        }
    });
    
    document.addEventListener('click',function(){
        cerrarLista();
    });

}

function seleccionar(items,indexFocus){
    if(!items || indexFocus==-1) return false;
    items.forEach(x => {
        x.classList.remove('autocompletar-active')
    });
    items[indexFocus].classList.add('autocompletar-active');
}

function cerrarLista(){
    const items=document.querySelectorAll('.lista-autocompletar-items');
    items.forEach(item => {
        item.parentNode.removeChild(item);
    });
    indexFocus=-1;
}

function httpRequest(url,callback){
    const http=new XMLHttpRequest();
    http.open('GET',url);
    http.send();

    http.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            callback.apply(http);
        }
    }
}

//autocompletar(['perro','gato','pez','paloma','conejo']);
autocompletar();