<template>
  <h1 class="text-white mt-10">Generador de Formatos</h1>
  <div class="flex justify-evenly items-center min-h-[400px]">
    <div class="flex flex-col gap-4">
      <input id="fileXLS" type="file" @change="handleFileUpload" accept=".xls,.xlsx">
      <div class="form-group">
        <input type="checkbox" name="credencial" id="credencial">
        <label for="credencial"> Añadir Credenciales</label>
      </div>
      <button :disabled="!fileSelected" @click="convertToJson">Crear Formato</button>
      <a href="/src/assets/doc/Plantilla_BaseDatos.xlsx" download>
        <button>Descargar Plantilla</button>
      </a>
    </div>
    <div v-if="valores.length">
      <iframe  ref="pdfPreview" width="150%" height="350"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import readXlsxFile from 'read-excel-file';
import jsPDF from 'jspdf';

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
};

const convertToJson = () => {
  const datos = {
    name:"Brian Roberto Salas Pardo",
    curp:"SAPB010313HVZLRRA7",
    ocupacion: "03 CONSTRUCCION",
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
    for (let i = 0; i < valores.value.length; i++) {
      doc.addImage("/img/logo.jpg",10,0,90,30)
      doc.addImage("/img/curso.jpg",170,0,30,30)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('FORMATO DC-3', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
      
      //Rectangulo Encabezado
      doc.setFillColor(0, 0, 0);
      doc.rect(9.9, 39, doc.internal.pageSize.getWidth()-19.9,7 , 'F');//Datos Trabajador
      doc.rect(9.9, 76, doc.internal.pageSize.getWidth() -19.9,7 , 'F');//Datos Empresa
      doc.rect(9.9, 103, doc.internal.pageSize.getWidth() -19.9,7 , 'F');//DATOS DEL PROGRAMA DE CAPACITACIÓN,
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
      doc.text(valores.value[i].nombre.toUpperCase(), gethalf(doc.getStringUnitWidth(valores.value[i].nombre),14,docWidth+2,scaleFactor),55);

      //Rectangulos del curp y ocupacion
      doc.rect(10,56, (doc.internal.pageSize.getWidth()/2)-10,10) //Rectangulo CURP
      doc.rect((doc.internal.pageSize.getWidth()/2),56,( doc.internal.pageSize.getWidth()/2)-10 ,10) // Rectangulo ocupacion
      doc.rect(10,66,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Puesto
      doc.rect(10,83,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Nombre Empresa
      doc.rect(10,93,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo registro
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
      doc.text(datos.ocupacion,(doc.internal.pageSize.getWidth()/2)+2,64)
      //Curp
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Clave Única de Registro de Población', 11,59);
      //Dato Curp
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(valores.value[i].curp, 11,64);
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
      doc.text(valores.value[i].rfc, 11,102);
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
      doc.text('Mes', 179, 123);
      doc.text('Dia', 192, 123);
      //Fechas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(valores.value[i].fecha_inicio.getFullYear().toString(), 97, 128);
      doc.text((valores.value[i].fecha_inicio.getMonth()+1).toString(), 117, 128);
      doc.text((valores.value[i].fecha_inicio.getDate()+1).toString(), 130, 128);
      doc.text(valores.value[i].fecha_termino.getFullYear().toString(), 158, 128);
      doc.text((valores.value[i].fecha_termino.getMonth()+1).toString(), 179, 128);
      doc.text((valores.value[i].fecha_termino.getDate()+1).toString(), 192, 128);
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
      doc.text(datos.capacitador.toUpperCase(), 11, 148);
      doc.text(datos.acestps.toUpperCase(), 98, 148);
      //Informacion de firmas
      doc.setFontSize(6.6);
      
      texto = "Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo"

      doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 154);
      texto ="aquel que no conduce con verdad."
      doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 157);

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7);
      doc.text("Instructor o Tutor", 33 ,170);

      doc.text(" Patrón o representante legal", 85 ,170);

      doc.text("Representante de los trabajadores", 144 ,170);

      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold')
      doc.text("TSIN. DAVID AVILA GARCIA", 28 ,190);
      doc.line(20,192,65,192)
      doc.text("LIC. MARIA ELENA MEDINA GONZALEZ", 82 ,190);
      doc.line(75,192,130,192)
      doc.text("LIC. VERÓNICA ZEPEDA USCANGA", 145 ,190);
      doc.line(140,192,186,192)

      if (i !== valores.value.length - 1) {
        doc.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
      }
    }
  doc.save('Formatos.pdf');
  const pdfBase64 = doc.output('datauristring');
  document.querySelector('iframe').src = pdfBase64;
};

function gethalf(texto,fontsize,docWidth, scale){
  var textWidth = texto * fontsize / scale;

  var textX = (docWidth - textWidth) / 2;
  return textX
}

</script>

