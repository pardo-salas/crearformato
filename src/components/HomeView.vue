<template>
  <h1 class="text-white my-8">Generador de Formatos</h1>
  <div class="flex justify-center gap-4">
    <a href="/doc/Plantilla_BaseDatos.xlsx" download>
      <button >Descargar Plantilla</button>
    </a>
    <button :disabled="!fileSelected" @click="generatingPDF = true,convertToJson()">Crear Formato</button>
    <button v-if="constancia" @click="crearConstancias()">Crear Constancia</button>
    <button v-if="credencial" @click="crearCredencial()">Crear Credencial</button>
  </div>
  <div class="flex flex-col justify-center items-center my-8 w-full">
    <div class="flex flex-col gap-2 p-2">
      <!-- Inputs  -->
      <div class="flex justify-center">
        <div class="flex flex-col justify-center items-center">
          <label>Ingresar Base de Datos</label>
          <input id="fileXLS" type="file" @change="handleFileUpload" accept=".xls,.xlsx">
        </div>
        <div class="flex flex-col justify-center items-center">
          <label>Ingresar Logo</label>
          <input id="fileImg" ref="imageInput1" @change="handleFileChange(1)" type="file" accept=".jpg,.jpeg,.png">
        </div>
        <div class="flex flex-col justify-center items-center">
          <label>Ingresar Logo Curso</label>
          <input id="fileImg" ref="imageInput2" @change="handleFileChange(2)" type="file" accept=".jpg,.png">
        </div>
      </div>
      <!-- Formulario -->
      <div class="flex flex-col mx-auto p-2 w-full justify-center items-center">
        <div class="grid grid-cols-4 gap-4 w-full">
          <!-- Razon Social -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="razon_social">Razon Social: </label>
            <input type="text" name="razon_social" v-model="razon_social" id="razon_social">
          </div>
          <!-- RFC -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="RFC">RFC: </label>
            <input type="text" v-mask="'AAA-######-AA#'"  name="RFC" v-model="rfc" id="RFC">
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 w-full">
          <!-- Ocupacion -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="ocupacion">Ocupacion: </label>
            <input type="text" name="ocupacion" v-model="ocupacion" id="ocupacion">
          </div>
          <!-- Capacitador -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="capacitador">Capacitador: </label>
            <input type="text" name="capacitador" v-model="capacitador" id="capacitador">
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 w-full">
          <!-- REGISTRO ACE STPS -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="acestps">Registro ACE STPS: </label>
            <input type="text" name="acestps" mask="000-00 00 00" v-model="acestps" id="acestps">
          </div>
          <!-- Instructor o Tutor -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="instructor">Instructor o Tutor: </label>
            <input type="text" name="instructor" v-model="instructor" id="instructor">
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 w-full">
          <!-- Patron o representante legal -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="replegal">Patron o representante legal: </label>
            <input type="text" name="replegal" v-model="replegal" id="replegal">
          </div>
          <!-- Representante de los trabajadores -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="pretrabajador">Representante de los trabajadores: </label>
            <input type="text" name="pretrabajador" v-model="pretrabajador" id="pretrabajador">
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 w-full">
          <!-- Patron o representante legal -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="curso">Curso: </label>
            <input type="text" name="curso" v-model="curso" id="curso">
          </div>
          <!-- Folio -->
          <div class="col-span-2 grid grid-cols-1 items-start">
            <label for="area">Area: </label>
            <input type="text" name="area" v-model="area" id="area">
          </div>
        </div>
        <div class="grid grid-cols-1 w-60 mt-2 ">
          <label for="folio">Folio: </label>
          <input type="text" name="folio" v-model="folio" id="replegal">
        </div>
      </div> <!-- End section -->
      <div class="flex flex-col mx-auto p-2 w-full justify-center items-center">
        <span>Firmas:</span>
        <div class="grid grid-cols-3 gap-4 w-full">
          <!-- Patron o representante legal -->
          <div class="col-span-1 grid grid-cols-1 items-start">
            <label for="instructorImg">Instructor: </label>
            <input type="file" ref="imageInput3" accept=".jpg,.jpeg,.png" @change="handleFileChange(3)">
          </div>
          <!-- Folio -->
          <div class="col-span-1 grid grid-cols-1 items-start">
            <label for="representanteImg">Representante Legal: </label>
            <input type="file" ref="imageInput4" accept=".jpg,.jpeg,.png" @change="handleFileChange(4)">
          </div>
          <!-- Folio -->
          <div class="col-span-1 grid grid-cols-1 items-start">
            <label for="area">Representante de trabajadores: </label>
            <input type="file" ref="imageInput5" name="area" accept=".jpg,.jpeg,.png" @change="handleFileChange(5)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePDFGenerator } from '../js/generateConstancia';

const { generatingPDF, generatePDF, generateConstancia ,generateCredencial } = usePDFGenerator();

import readXlsxFile from 'read-excel-file';

import jsPDF from 'jspdf';

let registroContancia = []
let registroCredencial = []

let area = ref("")
let folio = ref("TQR-03/2024-001")
let rfc =ref("IGC-050407-LA9");
let razon_social = ref("INDHECA GRUPO CONSTRUCTOR");
let ocupacion = ref("");
let capacitador= ref("AVILA GARCIA DAVID");
let acestps = ref("AIGD830407-BH2-0005")
let instructor = ref("ING. AVILA GARCIA DAVID")
let replegal = ref("LIC. MARIA ELENA MEDINA GONZALEZ")
let pretrabajador = ref("LIC. VERÓNICA ZEPEDA USCANGA")
let curso = ref("")

let imgLogo = ref(null);
let imgLogo2 = ref(null);
let firma1 = ref(null);
let firma2 = ref(null);
let firma3 = ref(null);
const imageInput1 = ref(null);
const imageInput2 = ref(null);
const imageInput3 = ref(null);
const imageInput4 = ref(null);
const imageInput5 = ref(null);

const deshabilitado = ref(false);
const constancia = ref(false);
const credencial = ref(false);

const valores = ref([]);
const fileSelected = ref(false)

const handleFileUpload = async (event) => {
  credencial.value =false
  constancia.value =false
  registroContancia = []
  registroCredencial = []

  valores.value = [];
  const input = event.target;
  const rows = await readXlsxFile(input.files[0]);
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  if (dataRows.length>0) {
    fileSelected.value=true
  }else{
    alert("El documento esta vacio");
    fileSelected.value=false
    input.value = null
    return
  }
  const dataArray = dataRows.map((row) => {
    const item = {};

    for (let i = 0; i < headers.length; i++) {
      item[headers[i]] = row[i];
    }

    return item;
  });
  valores.value = dataArray;
}

const handleFileChange = (index) => {
  let inputF
  switch (index) {
    case 1:
        inputF = imageInput1.value
        break;
      case 2:
        inputF = imageInput2.value;
        break;
      case 3:
      inputF = imageInput3.value;
        break;
      case 4:
      inputF = imageInput4.value;
        break;
      case 5:
      inputF = imageInput5.value;
        break;
      default:
        break;
  }

  if (inputF && inputF.files && inputF.files.length > 0) {
    const file = inputF.files[0];
    const imageURL = URL.createObjectURL(file);
    switch (index) {
      case 1:
        imgLogo.value = imageURL;
        break;
      case 2:
        imgLogo2.value = imageURL;
        break;
      case 3:
        firma1.value = imageURL;
        break;
      case 4:
        firma2.value = imageURL;
        break;
      case 5:
        firma3.value = imageURL;
        break;
      default:
        break;
    }
    if (index === 1) {
      imgLogo.value = imageURL;
    } else if (index === 2) {
      imgLogo2.value = imageURL;
    }
  }
};

function convertToJson()  {
  if(folio.value == ''){
    alert("el folio es obligatorio");
    return
  }
  if(rfc.value == '' ){
    alert("El rfc es obligatorio");
    return
  }
  if(rfc.value.length !== 14){
    alert("El RFC está mal escrito. Debe tener 12 caracteres.");
    return
  }

  let error = false
  for (let i = 0; i < valores.value.length; i++) {
    if (valores.value[i]["constancia"] == true || valores.value[i]["constancia"] == 'true' || valores.value[i]["constancia"] == 'verdadero' ) {
        registroContancia.push(valores.value[i])
      }
    if(valores.value[i]["credencial"]== true || valores.value[i]["credencial"] == 'true' || valores.value[i]["credencial"] == 'verdadero') {
      registroCredencial.push(valores.value[i])
      }
    if (valores.value[i]["curp"].length !== 18){
      alert("Esta erróneo el curp de " + valores.value[i]["nombre"])
      error = true
    }
  }

  if(!error){
    deshabilitado.value = true;
    let data = {
      folio: folio.value,
      rfc: rfc.value,
      razon_social : razon_social.value,
      ocupacion: ocupacion.value,
      capacitador :capacitador.value,
      acestps : acestps.value,
      instructor :instructor.value,
      replegal : replegal.value,
      pretrabajador : pretrabajador.value,
      curso : curso.value
    }
    let firmas = [firma1.value,firma2.value,firma3.value]
    generatePDF(valores.value,data,imgLogo.value,imgLogo2.value,firmas)

    // //Crear constancias
    if(registroContancia.length>0){
      constancia.value = true
    }
    //Crear credenciales
    if(registroCredencial.length>0){
      credencial.value = true
    }
    
    deshabilitado.value = false;
  }
}

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function crearConstancias(){
  const docCons = new jsPDF('landscape');
  for (let index = 0; index < registroContancia.length; index++) {
    docCons.addImage("/img/header.jpg",0,0,docCons.internal.pageSize.getWidth(),50)
    docCons.addImage("/img/curso.webp",20,150,40,40)
    docCons.setFontSize(12);
    docCons.text("folio:"+registroContancia[index].folio,226,198)
    docCons.addImage("/img/qr.jpg",230,150,40,40)

    let texto ="Se expide la presente constancia"
    let fontSize = 22;

    docCons.setFont('helvetica', 'bold');
    docCons.setTextColor(255, 255, 255);
    docCons.setFontSize(22);

    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),34)

    docCons.setFont('helvetica', 'normal');
    docCons.setFontSize(16);
    texto = "por su excelente participacion a:"
    fontSize=16
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),44)

    docCons.setFont('helvetica', 'bold');
    docCons.setTextColor(12, 80, 156);
    docCons.setFontSize(35);
    texto = registroContancia[index].nombre.toLowerCase()
    fontSize=35
    docCons.text(formatoNombre(texto),getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),70)

    docCons.setFont('helvetica', 'normal');
    docCons.setTextColor(67, 125, 181);
    docCons.setFontSize(18);
    texto = "Por haber concluido satisfactoriamente el curso"
    fontSize=18
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),85)

    docCons.setFont('helvetica', 'bold');
    docCons.setTextColor(67, 125, 181);
    docCons.setFontSize(38);
    texto = curso.value
    fontSize=38
    if(curso.value.length > 30 ){

      fontSize=30
      if (curso.value.length > 80) fontSize = 20 
      docCons.setFontSize(fontSize);
      let cursoLength = curso.value.length / 2;

      if (curso.value.length > 80) {
        
          let lineas = dividirTexto(texto, 70);

          // Definir la posición inicial de la primera línea
          let y = 95;

          // Agregar cada línea al documento
          lineas.forEach(linea => {
              docCons.text(linea, getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(linea, { fontSize }).w), y);
              y += 10; // Incrementar la posición Y para la siguiente línea
          });

      } else {
        
        let primeraMitad = curso.value.slice(0, cursoLength);
        let segundaMitad = curso.value.slice(cursoLength);
        if (texto.charAt(cursoLength) !== ' ' && texto.charAt(cursoLength - 1) !== ' ') {
          const espacioAnterior = primeraMitad.lastIndexOf(' ');
          const espacioSiguiente = segundaMitad.indexOf(' ');
          
          if (espacioAnterior !== -1 && espacioSiguiente !== -1) {
            primeraMitad = texto.slice(0, cursoLength + espacioSiguiente);
            segundaMitad = texto.slice(cursoLength + espacioSiguiente);
          }
        }
        texto = primeraMitad;
        docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),100)
        texto = segundaMitad
        docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),110)

      }

    }else{
      docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),105)
    }

    docCons.setFont('helvetica', 'normal');
    docCons.setTextColor(0, 0, 0);
    docCons.setFontSize(18);

    const dia = registroContancia[index].fecha_inicio.getDate() +1;
    const mes = meses[registroContancia[index].fecha_inicio.getMonth()];
    const anio =registroContancia[index].fecha_inicio.getFullYear();
    texto = `Impartido en Veracruz, Veracruz, el ${dia} de ${mes} del ${anio}`
    fontSize=18
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),126)

    docCons.setFont('helvetica', 'normal');
    texto = "con una duracion de "+registroContancia[index].duracion
    fontSize=18
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),136)

    docCons.line(115,170,180,170);
    texto = instructor.value
    docCons.setFontSize(8);
    fontSize=8
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),175) 

    texto = "Instructor"
    fontSize=8
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),180) 

    texto = "Registro STPS: "+acestps.value
    fontSize=8
    docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),185) 

    if (index !== registroContancia.length - 1) {
      docCons.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
    }
  }
  docCons.save("constancias");
}

function crearCredencial(){
  let data = {
      folio: folio.value,
      rfc: rfc.value,
      razon_social : razon_social.value,
      ocupacion: ocupacion.value,
      capacitador :capacitador.value,
      acestps : acestps.value,
      instructor :instructor.value,
      replegal : replegal.value,
      pretrabajador : pretrabajador.value,
      curso : curso.value
    }
  generateCredencial(registroCredencial,data)
}

function formatoNombre(cadena) {
    return cadena.replace(/\b\w/g, function(l) {
        return l.toUpperCase();
    });
}

// Función para dividir el texto en líneas
function dividirTexto(texto, maxLength) {
    let palabras = texto.split(' ');
    let lineas = [];
    let lineaActual = '';

    palabras.forEach(palabra => {
        if ((lineaActual + palabra).length < maxLength) {
            lineaActual += palabra + ' ';
        } else {
            lineas.push(lineaActual.trim());
            lineaActual = palabra + ' ';
        }
    });

    if (lineaActual.length > 0) {
        lineas.push(lineaActual.trim());
    }

    return lineas;
}


function getMidWidht(pagewidth,textWidth){
    return  (pagewidth - textWidth) / 2;
  
  }

</script>

