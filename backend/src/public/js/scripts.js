//alert('prueba');
//REFLEJAR EL TEXTO
const inputr = document.getElementById("texto");
const resultador = document.getElementById("caption");

inputr.addEventListener("input", (event) => {
    var varlores = event.target.value;
    resultador.innerHTML = varlores.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  });




//REFLEJAR LA IMAGEN
const inputimg = document.getElementById("img");
const imagenimg = document.getElementById("img-camp");

inputimg.addEventListener("change", function() {
  imagenimg.src = inputimg.value;
   
  
});
//values
const moneda = document.getElementById('formdba');

const miFuncionr = () => {
	let form = new FormData(moneda);
if(form.getAll('tipor')[0] === 'imgr'){
	document.getElementById("noimg").style.display = 'block';
    document.getElementById('img-camp').style.display = "block";
 
    
  console.log("SIII")
}
if(form.getAll('tipor')[0] === 'text'){
	document.getElementById("noimg").style.display = "none";
   
 
  console.log("NOO")
}
};
moneda.addEventListener('click', function() {
    miFuncionr();
});

 



 miFuncionr();
function recargar(){
    window.location.reload();
}
const  texto_copy = document.getElementById("code-result");
const copyButton = document.querySelector('#copy-button');
  copyButton.addEventListener('click', copyText);

  function copyText() {
    const textToCopy = texto_copy.innerText; // Reemplaza con el texto que quieras copiar
    navigator.clipboard.writeText(textToCopy);
  }
 
function irInicio(){
    window.location.href = "/";
}


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

 const monedas = document.getElementById('formdba');

 const miFuncionrs = () => {
     let form = new FormData(monedas);
 if(form.getAll('tipor')[0] === 'imgr'){
 
     document.getElementById('img-camp').style.display = "block";
 
     
   console.log("SIII")
 }
 if(form.getAll('tipor')[0] === 'text'){
  
     document.getElementById('img-camp').style.display = "none";
  
   console.log("NOO")
 }
 };
 monedas.addEventListener('click', function() {
     miFuncionrs();
 });

 miFuncionrs()



//emojis

$(function() {
    // Initializes and creates emoji set from sprite sheet
    window.emojiPicker = new EmojiPicker({
      emojiable_selector: '[data-emojiable=true]',
      assetsPath: '/images-emoji',
      popupButtonClasses: 'fa fa-smile-o' // far fa-smile if you're using FontAwesome 5
    });
    // Finds all elements with `emojiable_sevlector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    window.emojiPicker.discover();
  });

 


$(document).ready(function () {
    $("#formdba").submit(function (event) {
      $(".senders").attr("disabled", "disabled");
      var proyecto = $("#proyecto").val();
      var conexion = $("#conexion").val();
      var texto = $("#texto").val();
      var url_imagen = $("#img").val();
      const radioButtons = document.getElementsByName('tipor');
      let selectedValue;
      
      for (const radioButton of radioButtons) {
        if (radioButton.checked) {
          selectedValue = radioButton.value;
          break;
        }
      }
      var tipo = selectedValue;




     let link_img;
if (url_imagen === ""){
    link_img = null;
}else{
    link_img = url_imagen;
}

let tex;
if (texto === ""){
    tex = '⠀';
}else{
    tex = texto;
}
const dominioActual = window.location.hostname;

      function generateApiKey() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 32;
        let key = '';
        for (let i = 0; i < length; i++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
      }
      
      const apiKey0 = generateApiKey();
       
      const apiKey1 = apiKey0.slice(0, 4);
      const apiKey = apiKey1.toUpperCase();
      const now = new Date();
      const minute = now.getMinutes();
      const second = now.getSeconds();

     var codigo = 'GM-' + second+apiKey+minute
       
       
      var datos =  {
        "proyecto": proyecto,
        "conexion": conexion,
        "text": tex,
        "url_imagen":link_img,
        "codigo": codigo,
        "url_api":"api",
        "tipo_envio": tipo
     };

      $.ajax({
        // la URL para la petición
        url: "http://localhost:3001/tasks/add",
        cache: false,

        // la información a enviar
        // (también es posible utilizar una cadena de datos)

        crossDomain: true,
        // especifica si será una petición POST o GET
        type: "post",
		mode: "no-cors",        
        Accept: "application/json",
        AccessControlAllowCredentials: 'true',
        AccessControlAllowOrigin : '*',
        data:  JSON.stringify(datos),
		contentType: "application/json; charset=UTF-8",
       
        success: function (response) {
          //     $(".listo").show();
           
         // setTimeout(function () {
           // window.location.reload(1);
         // }, 8000);
         
     console.log('LISTO!!')
     document.getElementById('btn-nuevo').style.display = "block";
     document.getElementById('btn-cancel').style.visibility = "visible";
     document.getElementById('save').style.display = "none";
     const miBoton = document.getElementById('btn-nuevo');
  miBoton.disabled = false;

  const proyectorw = document.getElementById('proyecto');
  const proyecto_d = document.getElementById('proyecto-d');
  proyecto_d.innerText = proyectorw.value;


  const conexionw = document.getElementById('conexion');
  const conexion_d = document.getElementById('conexion-d');
  conexion_d.innerText = '+502 ' + conexionw.value;

 
  const codigo_d = document.getElementById('code-result');
  codigo_d.innerText = codigo;
  const tipo_d = document.getElementById('tipo-d');
  tipo_d.innerText = tipo;

  //readonly inputs
  const proyecto_w = document.getElementById('proyecto');
  proyecto_w.readOnly = true;
  proyecto_w.disabled = true;
  const conexion_w = document.getElementById('conexion');
  conexion_w.readOnly = true;
  img_w.disabled = true;
  const img_w = document.getElementById('img');
  img_w.readOnly = true;
  img_w.disabled = true;
  const text_w = document.getElementById('texto');
  text_w.readOnly = true;
  text_w.disabled = true;
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
 
          //setTimeout(function () {
           // window.location.reload(1);
          //}, 8000);
          console.log('NOO!')
          
             
        },
      });
    });
  });
 