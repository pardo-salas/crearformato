<template>
  <div class="flex flex-col gap-y-5 justify-center items-center">
    <h1 class="text-white">Subir Excel</h1>
    <input id="fileXLS" type="file" @change="handleFileUpload">
    <button @click="convertToJson">Crear</button>

    <iframe ref="pdfPreview" width="100%" height="500"></iframe>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import readXlsxFile from 'read-excel-file';
import jsPDF from 'jspdf';

const valores = ref([]);

const handleFileUpload = () => {
  const input = document.getElementById("fileXLS");
  readXlsxFile(input.files[0]).then((rows) => {
    valores.value = rows;
  });
};

const convertToJson = () => {
  const datos = {
    name:"Brian Roberto Salas Pardo",
    curp:"SAPB010313HVZLRRA7",
    ocupacion: " 03 CONSTRUCCION",
    puesto: "Programador",
    empresa:"INDHECA GRUPO CONSTRUCTOR",
    SCHP:"IGC-050407-LA9",
    curso:"REGLAMENTO FEDERAL DE SEGURIDAD, HIGIENE Y MEDIO AMBIENTE DE TRABAJO",
    duracion: "8 HRS.",
    yearInicio:"2024",
    monthInicio:"05",
    dayInicio:"01",
    yearFin:"2024",
    monthFin:"05",
    dayFin:"01",
    areaCurso:"6400 HIGIENE Y SEGURIDAD EN EL TRABAJO",
    capacitador:"AVILA GARCIA DAVID",
    acestps:"AIGD830407-BH2-0005"
  }
  const doc = new jsPDF();
    const docWidth = doc.internal.pageSize.getWidth();
    const scaleFactor =doc.internal.scaleFactor;
    let texto = ""
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('FORMATO DC-3', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
      
      //Rectangulo Encabezado
      doc.setFillColor(0, 0, 0);
      doc.rect(9.9, 30, doc.internal.pageSize.getWidth()-19.9,7 , 'F');//Datos Trabajador
      doc.rect(9.9, 66, doc.internal.pageSize.getWidth() -19.9,7 , 'F');//Datos Empresa
      doc.rect(9.9, 93, doc.internal.pageSize.getWidth() -19.9,7 , 'F');//DATOS DEL PROGRAMA DE CAPACITACIÓN,
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('DATOS DEL TRABAJADOR', (doc.internal.pageSize.getWidth() / 2) -25, 35);
      doc.text('DATOS DE LA EMPRESA', (doc.internal.pageSize.getWidth() / 2) -25, 71);
      doc.setFontSize(10);
      doc.text('DATOS DEL PROGRAMA DE CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD', 35 , 98);

      //Rectangulo Nombre
      doc.rect(10,36, doc.internal.pageSize.getWidth() -20,10)
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Nombre (Anotar apellido paterno, apellido materno y nombre (s))', 11,40); // Dibujar texto dentro del rectángulo
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(datos.name, (doc.internal.pageSize.getWidth() / 2) -25,45);

      //Rectangulos del curp y ocupacion
      doc.rect(10,46, (doc.internal.pageSize.getWidth()/2)-10,10) //Rectangulo CURP
      doc.rect((doc.internal.pageSize.getWidth()/2),46,( doc.internal.pageSize.getWidth()/2)-10 ,10) // Rectangulo ocupacion
      doc.rect(10,56,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Puesto
      doc.rect(10,73,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Nombre Empresa
      doc.rect(10,83,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo registro
      doc.rect(10,100,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo curso
      doc.rect(10,110,50 ,10) // Rectangulo duracion
      doc.rect(60,110,28 ,10) // Rectangulo periodo
      doc.rect(88,110,25 ,10) // Rectangulo año inicio
      doc.rect(113,110,13 ,10) // Rectangulo mes inicio
      doc.rect(126,110,13 ,10) // Rectangulo dia inicio
      doc.rect(139,110,10 ,10) // Rectangulo "a"
      doc.rect(149,110,25 ,10) // Rectangulo año fin
      doc.rect(174,110,13 ,10) // Rectangulo mes fin
      doc.rect(187,110,13 ,10) // Rectangulo dia fin
      doc.rect(10,120,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo area tematica curso
      doc.rect(10,130,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo capacitador
      doc.rect(10,140,doc.internal.pageSize.getWidth()-20 ,50) // Rectangulo firmas

      console.log(doc.internal.pageSize.getWidth()-70)
      //Ocupacion
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(' Ocupación específica (Catálogo Nacional de Ocupaciones)', doc.internal.pageSize.getWidth()/2,49);
      //Dato ocupacion
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(datos.ocupacion,doc.internal.pageSize.getWidth()/2,54)
      //Curp
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Clave Única de Registro de Población', 11,49);
      //Dato Curp
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(datos.curp, 11,54);
      //Puesto
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Puesto*', 11,59);
      //Datos Puesto   
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.puesto, 11,64);  
      //Empresa
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Nombre o razón social (En caso de persona física, anotar apellido paterno, apellido materno y nombre(s))', 11,76);
      //Datos Empresa
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.empresa, 11,81);
      //Registro federal Contribuyentes
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Registro Federal de Contribuyentes con homoclave (SHCP)', 11,86);
      //Datos Registro federal
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.SCHP, 11,92);
      //Nombre del Curso
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Nombre del curso', 11, 103);
      //Datos del curso
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.curso, 20, 108);
      // Duracion en horas
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Duracion en horas', 11, 113);
      //Datos de Duracion en horas
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.duracion, 30, 118);
      // Periodo de Ejecucion
      // Duracion en horas
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Periodo de', 62, 113);
      doc.text('ejecucion', 62, 115);
      doc.text('De', 78, 118);
      //Fechas 
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Año', 98, 113);
      doc.text('Mes', 117, 113);
      doc.text('Dia', 130, 113);
      doc.text('a', 143, 118);
      doc.text('Año', 160, 113);
      doc.text('Mes', 179, 113);
      doc.text('Dia', 192, 113);
      //Fechas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.yearInicio, 97, 118);
      doc.text(datos.monthInicio, 117, 118);
      doc.text(datos.dayInicio, 130, 118);
      doc.text(datos.yearFin, 158, 118);
      doc.text(datos.monthFin, 179, 118);
      doc.text(datos.dayFin, 192, 118);
      //Area Tematica curso
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Area tematica del curso:', 11, 123);
      //Area tematica curso datos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.areaCurso, 11, 128);
      //Capacitador
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Nombre del agente capacitador o STPS:', 11, 133);
      doc.setFontSize(10);
      doc.text('REGISTRO ACE STPS:', 60, 138);
      //Area tematica curso datos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(datos.capacitador, 11, 138);
      doc.text(datos.acestps, 98, 138);
      //Informacion de firmas
      doc.setFontSize(6.6);
      
      texto = "Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo"

      doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 144);
      texto ="aquel que no conduce con verdad."
      doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 147);

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7);
      doc.text("Instructor o Tutor", 33 ,160);

      doc.text(" Patrón o representante legal", 85 ,160);

      doc.text("Representante de los trabajadores", 144 ,160);

      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold')
      doc.text("TSIN. DAVID AVILA GARCIA", 28 ,180);
      doc.line(20,182,65,182)
      doc.text("LIC. MARIA ELENA MEDINA GONZALEZ", 82 ,180);
      doc.line(75,182,130,182)
      doc.text("LIC. VERÓNICA ZEPEDA USCANGA", 145 ,180);
      doc.line(140,182,186,182)

  const pdfBase64 = doc.output('datauristring');
  document.querySelector('iframe').src = pdfBase64;
};

function gethalf(texto,fontsize,docWidth, scale){
  var textWidth = texto * fontsize / scale;

  var textX = (docWidth - textWidth) / 2;
  return textX
}
</script>

