<template>
  <h1 class="text-white my-8">Generador de Formatos</h1>
  <div class="flex justify-center gap-4">
    <a href="/doc/Plantilla_BaseDatos.xlsx" download>
      <button>Descargar Plantilla</button>
    </a>
  
    <button :disabled="!fileSelected" @click="convertToJson">Crear Formato</button>
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
            <input id="fileImg" ref="imageInput1" @change="handleFileChange(1)" type="file" accept=".jpg,.png">
          </div>
          <div class="flex flex-col justify-center items-center">
            <label>Ingresar Logo Curso</label>
            <input id="fileImg" ref="imageInput2" @change="handleFileChange(2)" type="file" accept=".jpg,.png">
          </div>
          <div class="flex flex-col justify-center items-center">
  
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
          <!-- Folio -->
          <div class="w-72 grid grid-cols-1 items-start">
            <label for="folio">Folio: </label>
            <input type="text" name="folio" v-model="folio" id="folio">
          </div>
        </div>
      </div>
      <div class="p-4 flex" v-if="valores.length">
        <iframe  ref="pdfPreview" width="500" height="500"></iframe>
        <iframe id="pdfConstancia" ref="pdfPreview" width="500" height="500"></iframe>
      </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import readXlsxFile from 'read-excel-file';
import {mask} from 'vue-the-mask'

import jsPDF from 'jspdf';

let folio = ref("")
let rfc =ref("");
let razon_social = ref("");
let ocupacion = ref("");
let capacitador= ref("");
let acestps = ref("")
let instructor = ref("")
let replegal = ref("")
let pretrabajador = ref("")

let imgLogo = ref(null);
let imgLogo2 = ref(null);
const imageInput1 = ref(null);
const imageInput2 = ref(null);

const valores = ref([]);
const fileSelected = ref(false)

const handleFileUpload = async () => {
  const input = document.getElementById("fileXLS");
  const rows = await readXlsxFile(input.files[0]);
  if (rows.length>0) {
    fileSelected.value=true
  }else{
    fileSelected.value=false
  }
  const headers = rows[0];
  const dataRows = rows.slice(1);

  const dataArray = dataRows.map((row) => {
    const item = {};

    for (let i = 0; i < headers.length; i++) {
      item[headers[i]] = row[i];
    }

    return item;
  });
  valores.value = dataArray;
  // console.log(valores.value)
}

const handleFileChange = (index) => {
  const fileInput = index === 1 ? imageInput1.value : imageInput2.value;
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const imageURL = URL.createObjectURL(file);
    if (index === 1) {
      imgLogo.value = imageURL;
    } else if (index === 2) {
      imgLogo2.value = imageURL;
    }
  }
};

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const convertToJson = () => {
  const doc = new jsPDF();
  const docWidth = doc.internal.pageSize.getWidth();
  const scaleFactor =doc.internal.scaleFactor;
  let texto = ""
  let imagen1 = imgLogo.value == null ? "/img/logo.jpg" : imgLogo.value
  let imagen2 = imgLogo2.value == null ? "/img/curso.jpg" : imgLogo2.value
  let registroContancia = []
  let registroCredencial
  //Crear Formatos
  for (let i = 0; i < valores.value.length; i++) {
    if (valores.value[i]["constancia"]) {
      registroContancia.push(valores.value[i])
    }  
    doc.addImage(imagen1,10,0,90,30)
    doc.addImage(imagen2,170,0,30,30)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('FORMATO DC-3', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
    
    //Rectangulo Encabezado
    doc.setFillColor(0, 0, 0);
    doc.rect(9.9, 39, doc.internal.pageSize.getWidth()-19.8,7 , 'F');//Datos Trabajador
    doc.rect(9.9, 76, doc.internal.pageSize.getWidth() -19.8,7 , 'F');//Datos Empresa
    doc.rect(9.9, 103, doc.internal.pageSize.getWidth() -19.8,7 , 'F');//DATOS DEL PROGRAMA DE CAPACITACIÓN,
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL TRABAJADOR', (doc.internal.pageSize.getWidth() / 2) -25, 44);
    doc.text('DATOS DE LA EMPRESA', (doc.internal.pageSize.getWidth() / 2) -25, 81);
    doc.setFontSize(10);
    doc.text('DATOS DEL PROGRAMA DE CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD', 35 , 108);

    //Rectangulo Nombre
    doc.rect(10,46, doc.internal.pageSize.getWidth() -20,10)
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Nombre (Anotar apellido paterno, apellido materno y nombre (s))', 11,50); // Dibujar texto dentro del rectángulo
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(valores.value[i].nombre.toUpperCase(), gethalf(doc.getStringUnitWidth(valores.value[i].nombre),14,docWidth-20,scaleFactor),55);

    //Rectangulos del curp y ocupacion
    doc.rect(10,56, (doc.internal.pageSize.getWidth()/2)-10,10) //Rectangulo CURP
    doc.rect((doc.internal.pageSize.getWidth()/2),56,( doc.internal.pageSize.getWidth()/2)-10 ,10) // Rectangulo ocupacion
    doc.rect(10,66,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Puesto
    doc.rect(10,83,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Nombre Empresa
    doc.rect(10,93,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo RFC
    doc.rect(10,110,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo curso
    doc.rect(10,120,50 ,10) // Rectangulo duracion
    doc.rect(60,120,28 ,10) // Rectangulo periodo
    doc.rect(88,120,25 ,10) // Rectangulo año inicio
    doc.rect(113,120,13 ,10) // Rectangulo mes inicio
    doc.rect(126,120,13 ,10) // Rectangulo dia inicio
    doc.rect(139,120,10 ,10) // Rectangulo "a"
    doc.rect(149,120,25 ,10) // Rectangulo año fin
    doc.rect(174,120,13 ,10) // Rectangulo mes fin
    doc.rect(187,120,13 ,10) // Rectangulo dia fin
    doc.rect(10,130,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo area tematica curso
    doc.rect(10,140,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo capacitador
    doc.rect(10,150,doc.internal.pageSize.getWidth()-20 ,50) // Rectangulo firmas

    //Ocupacion
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Ocupación específica (Catálogo Nacional de Ocupaciones)', (doc.internal.pageSize.getWidth()/2)+2,59);
    //Dato ocupacion
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(ocupacion.value,(doc.internal.pageSize.getWidth()/2)+2,64)
    //Curp
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Clave Única de Registro de Población', 11,59);
    //Dato Curp
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    let x = 15.2;
    let sum = ((doc.internal.pageSize.getWidth()/2)-10) / 18
    for (let index = 0; index < 18; index++) {
      doc.text(valores.value[i].curp[index], x-3.8,65);
      doc.line(x,66,x,62)
      x+=sum;
    }

    //Puesto
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Puesto*', 11,69);
    //Datos Puesto   
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(valores.value[i].puesto.toUpperCase(), 11,74);  
    //Empresa
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Nombre o razón social (En caso de persona física, anotar apellido paterno, apellido materno y nombre(s))', 11,86);
    //Datos Empresa
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(razon_social.value, 11,91);
    //Registro federal Contribuyentes
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Registro Federal de Contribuyentes con homoclave (SHCP)', 11,96);
    //Datos Registro federal
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    let xRFC = 20
    doc.line(15,98,15,103);
    for (let index = 0; index < 14; index++) {
      doc.line(xRFC,98,xRFC,103)
      doc.text(rfc.value[index], xRFC-3.4,102);
      xRFC+=5
    }
    //Nombre del Curso
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Nombre del curso', 11, 113);
    //Datos del curso
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(valores.value[i].curso, gethalf(doc.getStringUnitWidth(valores.value[i].curso),10,docWidth-1,scaleFactor), 118);
    // Duracion en horas
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Duracion en horas', 11, 123);
    //Datos de Duracion en horas
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(valores.value[i].duracion, 30, 128);
    // Periodo de Ejecucion
    // Duracion en horas
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Periodo de', 62, 123);
    doc.text('ejecucion', 62, 125);
    doc.text('De', 78, 128);
    //Fechas 
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Año', 98, 123);
    doc.text('Mes', 117, 123);
    doc.text('Dia', 130, 123);
    doc.text('a', 143, 128);
    doc.text('Año', 160, 123);
    doc.text('Mes', 178.5, 123);
    doc.text('Dia', 192, 123);
    //Fechas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    x=88
    let xDFin = 149
    for (let index = 0; index < 4; index++) {
      doc.text(valores.value[i].fecha_inicio.getFullYear().toString()[index], x+2.5, 128.5);
      doc.text(valores.value[i].fecha_termino.getFullYear().toString()[index], xDFin+2.5, 128.5);

      doc.line(x,130,x,125)
      doc.line(xDFin,130,xDFin,125)
      xDFin += 6.25
      x+=6.25
    }
    x=119.5
    xDFin = 180.5
    for (let index = 0; index < 2; index++) {

      if(index == 0 && (valores.value[i].fecha_inicio.getMonth()+1).toString().length == 1) {
        doc.line(x,130,x,125)
        doc.text('0', x-4, 128.5);
      } else{
        doc.text((valores.value[i].fecha_inicio.getMonth()+1).toString(), x-1, 128.5);
      }

      if(index == 0 && (valores.value[i].fecha_termino.getMonth()+1).toString().length == 1){
        doc.line(xDFin,130,xDFin,125)
        doc.text('0', xDFin-4, 128.5);
      }else{
        doc.text((valores.value[i].fecha_termino.getMonth()+1).toString(), xDFin+2.5, 128.5);
      }
      x+=3.25
    }

    doc.line(132,130,132,125)
    if((valores.value[i].fecha_inicio.getDate()+1).toString().length == 0){
      doc.text('0',128,128)
      doc.text((valores.value[i].fecha_inicio.getDate()+1).toString(), 130, 128);
    }else{
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString()[0],128,128.5)
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString()[1],134.5, 128.5);
    }

    doc.line(193.5,130,193.5,125)
    if((valores.value[i].fecha_termino.getDate()+1).toString().length == 0){
      doc.text('0',190.25,128.5)
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString(), 196.75, 128.5);
    }else{
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString()[0],189.25,128.5)
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString()[1],196, 128.5);
    }

    //Area Tematica curso
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Area tematica del curso:', 11, 133);
    //Area tematica curso datos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(valores.value[i].area.toUpperCase(), 11, 138);
    //Capacitador
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Nombre del agente capacitador o STPS:', 11, 143);
    doc.setFontSize(10);
    doc.text('REGISTRO ACE STPS:', 60, 148);
    //Area tematica curso datos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(capacitador.value.toUpperCase(), 11, 148);
    doc.text(acestps.value.toUpperCase(), 98, 148);
    //Informacion de firmas
    doc.setFontSize(6.6);
    
    texto = "Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo"

    doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 154);
    texto ="aquel que no conduce con verdad."
    doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 157);

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7);
    doc.text("Instructor o Tutor", 33 ,170);

    doc.text("Patrón o representante legal", 85 ,170);

    doc.text("Representante de los trabajadores", 144 ,170);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold')
    doc.text(instructor.value.toUpperCase(), gethalf(doc.getStringUnitWidth(instructor.value),6,45,scaleFactor)+20 ,190);
    doc.line(20,192,65,192)
    doc.text(replegal.value.toUpperCase(), gethalf(doc.getStringUnitWidth(replegal.value),6,55,scaleFactor)+75 ,190);
    doc.line(75,192,130,192)
    doc.text(pretrabajador.value.toUpperCase(), gethalf(doc.getStringUnitWidth(replegal.value),6,55,scaleFactor)+140 ,190);
    doc.line(140,192,186,192)
    
    const folioCreated =folio.value+"-"+String(i+1).padStart(3, '0');
    doc.text("folio: "+folioCreated,175,210)
    valores.value[i].folio = folioCreated
    if (i !== valores.value.length - 1) {
      doc.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
    }
  }
  const pdfBase64 = doc.output('datauristring');
  document.querySelector('iframe').src = pdfBase64;
  //Crear constancias
  if(registroContancia.length>0){
    const docCons = new jsPDF('landscape');
    for (let index = 0; index < registroContancia.length; index++) {
      docCons.addImage("img/header.jpg",0,0,docCons.internal.pageSize.getWidth(),50)
      docCons.addImage(imagen2,20,150,40,40)
      docCons.setFontSize(12);
      docCons.text("folio:"+registroContancia[index].folio,226,198)
      docCons.addImage("img/qr.jpg",230,150,40,40)

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
      docCons.setTextColor(0, 0, 128);
      docCons.setFontSize(35);
      texto = registroContancia[index].nombre
      fontSize=35
      docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),70)

      docCons.setFont('helvetica', 'normal');
      docCons.setTextColor(38, 32, 72);
      docCons.setFontSize(18);
      texto = "Por haber concluido satisfactoriamente el curso"
      fontSize=18
      docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),85)

      docCons.setFont('helvetica', 'bold');
      docCons.setTextColor(38, 32, 72);
      docCons.setFontSize(38);
      texto = registroContancia[index].curso 
      fontSize=38
      if(registroContancia[index].curso.length >30 ){
        let primeraMitad = registroContancia[index].curso.slice(0, 30);
        let segundaMitad = registroContancia[index].curso.slice(30);
        if (texto.charAt(30) !== ' ' && texto.charAt(30 - 1) !== ' ') {
          const espacioAnterior = primeraMitad.lastIndexOf(' ');
          const espacioSiguiente = segundaMitad.indexOf(' ');
          
          if (espacioAnterior !== -1 && espacioSiguiente !== -1) {
            primeraMitad = texto.slice(0, 30 + espacioSiguiente);
            segundaMitad = texto.slice(30 + espacioSiguiente);
          }
        }
        texto = primeraMitad;
        docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),105)
        texto = segundaMitad
        docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),118)

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

      const iframe = document.getElementById('pdfConstancia');
      const pdfBase64 = docCons.output('datauristring');
      iframe.src = pdfBase64
      if (index !== registroContancia.length - 1) {
        docCons.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
    }
    }

  }
}

function gethalf(texto,fontsize,docWidth, scale){
  var textWidth = texto * fontsize / scale;

  var textX = (docWidth - textWidth) / 2;
  return textX
}

// onMounted(()=>{
//     const docCons = new jsPDF('landscape');
//     docCons.addImage("img/header.jpg",0,0,docCons.internal.pageSize.getWidth(),50)
//     docCons.addImage("img/curso.jpg",20,150,40,40)
//     docCons.addImage("img/qr.jpg",230,150,40,40)

//     let texto ="Se expide la presente constancia"
//     let fontSize = 22;

//     docCons.setFont('helvetica', 'bold');
//     docCons.setTextColor(255, 255, 255);
//     docCons.setFontSize(22);

//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),34)

//     docCons.setFont('helvetica', 'normal');
//     docCons.setFontSize(16);
//     texto = "por su excelente participacion a:"
//     fontSize=16
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),44)

//     docCons.setFont('helvetica', 'bold');
//     docCons.setTextColor(0, 0, 128);
//     docCons.setFontSize(35);
//     texto = "Zacarias Aguilar Tapia"
//     fontSize=35
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),70)

//     docCons.setFont('helvetica', 'bold');
//     docCons.setTextColor(30, 30, 120);
//     docCons.setFontSize(35);
//     texto = "Zacarias Aguilar Tapia"
//     fontSize=35
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),70)

//     docCons.setFont('helvetica', 'normal');
//     docCons.setTextColor(38, 32, 72);
//     docCons.setFontSize(18);
//     texto = "Por haber concluido satisfactoriamente el curso"
//     fontSize=18
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),85)

//     docCons.setFont('helvetica', 'bold');
//     docCons.setTextColor(38, 32, 72);
//     docCons.setFontSize(38);
//     texto = "Basico de seguridad Industrial"
//     fontSize=38
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),105)

//     docCons.setFont('helvetica', 'normal');
//     docCons.setTextColor(0, 0, 0);
//     docCons.setFontSize(18);
//     texto = "Impartido en Veracruz, Veracruz, el 11 de abril del 2024"
//     fontSize=18
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),125)

//     docCons.setFont('helvetica', 'normal');
//     texto = "con una duracion de 8 horas"
//     fontSize=18
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),135)

//     docCons.line(115,170,180,170);
//     texto = "Ing. David Ávila García"
//     docCons.setFontSize(8);
//     fontSize=8
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),175) 

//     texto = "Instructor"
//     fontSize=8
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),180) 

//     texto = "Registro STPS: AIGD-830407-BH2-0005"
//     fontSize=8
//     docCons.text(texto,getMidWidht(docCons.internal.pageSize.getWidth(), docCons.getTextDimensions(texto, { fontSize }).w),185) 



//     const pdfBase64 = docCons.output('datauristring');
//     document.querySelector('iframe').src = pdfBase64;
// })

function getMidWidht(pagewidth,textWidth){
  return  (pagewidth - textWidth) / 2;

}

</script>

