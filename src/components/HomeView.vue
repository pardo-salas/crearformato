<template>
  <h1 class="text-white mt-10">Generador de Formatos</h1>
    <div class="flex justify-center items-center my-8 w-full">
      <!-- <a href="/doc/Plantilla_BaseDatos.xlsx" download>
        <button>Descargar Plantilla</button>
      </a> -->
      <div class="flex flex-col gap-2 m-2 p-2">
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
        <!-- Ocupacion -->
        <div class="grid grid-cols-1 items-start">
          <label for="ocupacion">Ocupacion: </label>
          <input type="text" name="ocupacion" v-model="ocupacion" id="ocupacion">
        </div>
        <!-- Capacitador -->
        <div class="grid grid-cols-1 items-start">
          <label for="capacitador">Capacitador: </label>
          <input type="text" name="capacitador" v-model="capacitador" id="capacitador">
        </div>
        <!-- REGISTRO ACE STPS -->
        <div class="grid grid-cols-1 items-start">
          <label for="acestps">Registro ACE STPS: </label>
          <input type="text" name="acestps" v-model="acestps" id="acestps">
        </div>
        <!-- Instructor o Tutor -->
        <div class="grid grid-cols-1 items-start">
          <label for="instructor">Instructor o Tutor: </label>
          <input type="text" name="instructor" v-model="instructor" id="instructor">
        </div>
        <!-- Patron o representante legal -->
        <div class="grid grid-cols-1 items-start">
          <label for="replegal">Patron o representante legal: </label>
          <input type="text" name="replegal" v-model="replegal" id="replegal">
        </div>
        <!-- Representante de los trabajadores -->
        <div class="grid grid-cols-1 items-start">
          <label for="pretrabajador">Representante de los trabajadores: </label>
          <input type="text" name="pretrabajador" v-model="pretrabajador" id="pretrabajador">
        </div>
      </div>

      <div class="p-4" v-if="valores.length">
        <iframe  ref="pdfPreview" width="500" height="500"></iframe>
      </div>
    </div>
  <button :disabled="!fileSelected" @click="convertToJson">Crear Formato</button>
</template>

<script setup>
import { ref } from 'vue';
import readXlsxFile from 'read-excel-file';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const convertToJson = () => {
  const doc = new jsPDF();
    const docWidth = doc.internal.pageSize.getWidth();
    const scaleFactor =doc.internal.scaleFactor;
    let texto = ""
    let imagen1 = imgLogo.value == null ? "/img/logo.jpg" : imgLogo.value
    let imagen2 = imgLogo2.value == null ? "/img/curso.jpg" : imgLogo2.value

    for (let i = 0; i < valores.value.length; i++) {
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
      doc.text(valores.value[i].razon_social, 11,91);
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
      for (let index = 0; index < 13; index++) {
        doc.line(xRFC,98,xRFC,103)
        doc.text(valores.value[i].rfc[index], xRFC-3.4,102);
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
      doc.text(instructor.value.toUpperCase(), 28 ,190);
      doc.line(20,192,65,192)
      doc.text(replegal.value.toUpperCase(), 82 ,190);
      doc.line(75,192,130,192)
      doc.text(pretrabajador.value.toUpperCase(), 145 ,190);
      doc.line(140,192,186,192)

      if (i !== valores.value.length - 1) {
        doc.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
      }
    }
  const pdfBase64 = doc.output('datauristring');
  document.querySelector('iframe').src = pdfBase64;
  
}

function gethalf(texto,fontsize,docWidth, scale){
  var textWidth = texto * fontsize / scale;

  var textX = (docWidth - textWidth) / 2;
  return textX
}

</script>

