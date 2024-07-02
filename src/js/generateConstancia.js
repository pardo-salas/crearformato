import { ref } from 'vue';
import jsPDF from 'jspdf';

export function usePDFGenerator() {
  const generatingPDF = ref(false);
 

  async function generatePDF(registros,datos) {
    generatingPDF.value = true;
    try {
      await new Promise((resolve, reject)=>{
        const doc = new jsPDF();
        const docWidth = doc.internal.pageSize.getWidth();
        const scaleFactor =doc.internal.scaleFactor;
        let texto = ""
        let imagen1 = "/img/logo.webp"
        let imagen2 = "/img/curso.webp"
        const folioArray = datos.folio.split('-');
        let consecutivo = folioArray[folioArray.length-1].replace(/^0+/, '');
        let altura = 9
        
        //Crear Formatos
        for (let i = 0; i < registros.length; i++) {
          doc.addImage(imagen1,10,8+altura,78,15)
          doc.addImage(imagen2,150,altura-5,45,35)
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('FORMATO DC-3', doc.internal.pageSize.getWidth() / 2, 30+altura, { align: 'center' });
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES', doc.internal.pageSize.getWidth() / 2, 36+altura, { align: 'center' });
          
          //Rectangulo Encabezado
          doc.setFillColor(0, 0, 0);
          doc.rect(9.9, 39+altura, doc.internal.pageSize.getWidth()-19.8,7 , 'F');//Datos Trabajador
          doc.rect(9.9, 76+altura, doc.internal.pageSize.getWidth() -19.8,7 , 'F');//Datos Empresa
          doc.rect(9.9, 103+altura, doc.internal.pageSize.getWidth() -19.8,7 , 'F');//DATOS DEL PROGRAMA DE CAPACITACIÓN,
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.text('DATOS DEL TRABAJADOR', (doc.internal.pageSize.getWidth() / 2) -25, 44+altura);
          doc.text('DATOS DE LA EMPRESA', (doc.internal.pageSize.getWidth() / 2) -25, 81+altura);
          doc.setFontSize(10);
          doc.text('DATOS DEL PROGRAMA DE CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD', 35 , 108+altura);

          //Rectangulo Nombre
          doc.rect(10,46+altura, doc.internal.pageSize.getWidth() -20,10)
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Nombre (Anotar apellido paterno, apellido materno y nombre (s))', 11,50+altura); // Dibujar texto dentro del rectángulo
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(registros[i].nombre.toUpperCase(), gethalf(doc.getStringUnitWidth(registros[i].nombre),10,docWidth-20,scaleFactor),55+altura);

          //Rectangulos del curp y ocupacion
          doc.rect(10,56+altura, (doc.internal.pageSize.getWidth()/2)-10,10) //Rectangulo CURP
          doc.rect((doc.internal.pageSize.getWidth()/2),56+altura,( doc.internal.pageSize.getWidth()/2)-10 ,10) // Rectangulo ocupacion
          doc.rect(10,66+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Puesto
          doc.rect(10,83+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo Nombre Empresa
          doc.rect(10,93+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo RFC
          doc.rect(10,110+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo curso
          doc.rect(10,120+altura,50 ,10) // Rectangulo duracion
          doc.rect(60,120+altura,28 ,10) // Rectangulo periodo
          doc.rect(88,120+altura,25 ,10) // Rectangulo año inicio
          doc.rect(113,120+altura,13 ,10) // Rectangulo mes inicio
          doc.rect(126,120+altura,13 ,10) // Rectangulo dia inicio
          doc.rect(139,120+altura,10 ,10) // Rectangulo "a"
          doc.rect(149,120+altura,25 ,10) // Rectangulo año fin
          doc.rect(174,120+altura,13 ,10) // Rectangulo mes fin
          doc.rect(187,120+altura,13 ,10) // Rectangulo dia fin
          doc.rect(10,130+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo area tematica curso
          doc.rect(10,140+altura,doc.internal.pageSize.getWidth()-20 ,10) // Rectangulo capacitador
          doc.rect(10,150+altura,doc.internal.pageSize.getWidth()-20 ,50) // Rectangulo firmas

          //Ocupacion
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Ocupación específica (Catálogo Nacional de Ocupaciones)', (doc.internal.pageSize.getWidth()/2)+2,59+altura);
          //Dato ocupacion
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(datos.ocupacion,(doc.internal.pageSize.getWidth()/2)+2,64+altura)
          //Curp
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Clave Única de Registro de Población', 11,59+altura);
          //Dato Curp
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          let x = 15.2;
          let sum = ((doc.internal.pageSize.getWidth()/2)-10) / 18
          for (let index = 0; index < 18; index++) {
            doc.text(registros[i].curp[index], x-3.8,65+altura);
            doc.line(x,66+altura,x,62+altura)
            x+=sum;
          }

          //Puesto
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Puesto*', 11,69+altura);
          //Datos Puesto   
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(registros[i].puesto.toUpperCase(), 11,74+altura);  
          //Empresa
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Nombre o razón social (En caso de persona física, anotar apellido paterno, apellido materno y nombre(s))', 11,86+altura);
          //Datos Empresa
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(datos.razon_social, 11,91+altura);
          //Registro federal Contribuyentes
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Registro Federal de Contribuyentes con homoclave (SHCP)', 11,96+altura);
          //Datos Registro federal
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          let xRFC = 20
          for (let index = 0; index < 14; index++) {
            doc.line(xRFC,98+altura,xRFC,103+altura)
            doc.text(datos.rfc[index], xRFC-3.4,102+altura);
            xRFC+=5
          }
          //Nombre del Curso
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Nombre del curso', 11, 113+altura);
          //Datos del curso
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(curso.value, gethalf(doc.getStringUnitWidth(curso.value),12,docWidth-1,scaleFactor), 118+altura);
          // Duracion en horas
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Duracion en horas', 11, 123+altura);
          //Datos de Duracion en horas
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(registros[i].duracion, 30, 128+altura);
          // Periodo de Ejecucion
          // Duracion en horas
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Periodo de', 62, 123+altura);
          doc.text('ejecucion', 62, 125+altura);
          doc.text('De', 78, 128+altura);
          //Fechas 
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Año', 98, 123+altura);
          doc.text('Mes', 117, 123+altura);
          doc.text('Dia', 130, 123+altura);
          doc.text('a', 143, 128+altura);
          doc.text('Año', 160, 123+altura);
          doc.text('Mes', 178.5, 123+altura);
          doc.text('Dia', 192, 123+altura);
          //Fechas
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          x=88
          let xDFin = 149
          for (let index = 0; index < 4; index++) {
            doc.text(registros[i].fecha_inicio.getFullYear().toString()[index], x+2.5, 128.5+altura);
            doc.text(registros[i].fecha_termino.getFullYear().toString()[index], xDFin+2.5, 128.5+altura);

            doc.line(x,130+altura,x,125+altura)
            doc.line(xDFin,130+altura,xDFin,125+altura)
            xDFin += 6.25
            x+=6.25
          }
          
          xDFin = 180.5
          //Meses
          doc.line(119.5,130+altura,119.5,125+altura)
          if((registros[i].fecha_inicio.getMonth()+1).toString().length == 1) {
            doc.text('0', 115, 128.5+altura);
            doc.text((registros[i].fecha_inicio.getMonth()+1).toString(), 121.5, 128.5+altura);
          } else{
            doc.text((registros[i].fecha_inicio.getMonth()+1).toString()[0], 115.5, 128.5+altura);
            doc.text((registros[i].fecha_inicio.getMonth()+1).toString()[1], 121.5, 128.5+altura);
          }

          doc.line(180.5,130+altura,180.5,125+altura)
          if((registros[i].fecha_termino.getMonth()+1).toString().length == 1){
            doc.text('0', 176.5, 128.5+altura);
            doc.text((registros[i].fecha_termino.getMonth()+1).toString(), 182.5, 128.5+altura);
          }else{
            doc.text((registros[i].fecha_termino.getMonth()+1).toString()[0], 176.5, 128.5+altura);
            doc.text((registros[i].fecha_termino.getMonth()+1).toString()[1], 181.5, 128.5+altura);
          }
          //Dias
          doc.line(132,130+altura,132,125+altura)
          if((registros[i].fecha_inicio.getDate()+1).toString().length == 1){
            doc.text('0',128,128.5+altura)
            doc.text((registros[i].fecha_inicio.getDate()+1).toString(), 134, 128.5+altura);
          }else{
            doc.text((registros[i].fecha_inicio.getDate()+1).toString()[0],128,128.5+altura)
            doc.text((registros[i].fecha_inicio.getDate()+1).toString()[1],134.5, 128.5+altura);
          }

          doc.line(193.5,130+altura,193.5,125+altura)
          if((registros[i].fecha_termino.getDate()+1).toString().length == 1){
            doc.text('0',190.25,128.5+altura)
            doc.text((registros[i].fecha_termino.getDate()+1).toString(), 196.75, 128.5+altura);
          }else{
            doc.text((registros[i].fecha_termino.getDate()+1).toString()[0],189.25,128.5+altura)
            doc.text((registros[i].fecha_termino.getDate()+1).toString()[1],196, 128.5+altura);
          }

          //Area Tematica curso
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Area tematica del curso:', 11, 133+altura);
          //Area tematica curso datos
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(area.value.toUpperCase(), 11, 138+altura);
          //Capacitador
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Nombre del agente capacitador o STPS:', 11, 143+altura);
          doc.setFontSize(10);
          doc.text('REGISTRO ACE STPS:', 60, 148+altura);
          //Area tematica curso datos
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(datos.capacitador.toUpperCase(), 11, 148+altura);
          doc.text(datos.acestps.toUpperCase(), 98, 148+altura);
          //Informacion de firmas
          doc.setFontSize(6.6);
          
          texto = "Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo"

          doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 154+altura);
          texto ="aquel que no conduce con verdad."
          doc.text(texto, gethalf(doc.getStringUnitWidth(texto),6.6,docWidth,scaleFactor), 157+altura);

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7);
          doc.text("Instructor o Tutor", 33 ,170+altura);
          doc.addImage("/img/avila.png",'PNG',15,170+altura,60,25)
          doc.text("Nombre y Firma",35,195+altura)
          doc.text("Patrón o representante legal", 85 ,170+altura);
          doc.addImage("/img/mariaelena.png",87,166+altura,30,40)
          doc.text("Nombre y Firma",92,195+altura)
          doc.text("Representante de los trabajadores", 144 ,170+altura);
          doc.addImage("/img/veronica.png",147,174+altura,30,20)
          doc.text("Nombre y Firma",155,195+altura)


          doc.setFontSize(6);
          doc.setFont('helvetica', 'bold')
          doc.text(datos.instructor.toUpperCase(), gethalf(doc.getStringUnitWidth(datos.instructor),6,45,scaleFactor)+20 ,190+altura);
          doc.line(20,192+altura,65,192+altura)
          doc.text(datos.replegal.toUpperCase(), gethalf(doc.getStringUnitWidth(datos.replegal),6,55,scaleFactor)+75 ,190+altura);
          doc.line(75,192+altura,130,192+altura)
          doc.text(datos.pretrabajador.toUpperCase(), gethalf(doc.getStringUnitWidth(datos.pretrabajador),6,55,scaleFactor)+140 ,190+altura);
          doc.line(140,192+altura,186,192+altura)

          doc.setFontSize(10.5);
          doc.text('INSTRUCCIONES',10,210+altura);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal')
          doc.text('- Llenar a máquina o con letra de molde.',10,215+altura)
          doc.text('- Deberá entregarse al trabajador dentro de los veinte días hábiles siguientes al término del curso de capacitación aprobado.',10,218+altura)
          doc.text('1/   Las áreas y subáreas ocupacionales del Catálogo Nacional de Ocupaciones se encuentran disponibles en el reverso de este formato',10,221+altura)
          doc.text('y en la página www.stps.gob.mx',10,224+altura);

          doc.text('2/   Las áreas temáticas de los cursos se encuentran disponibles en el reverso de este formato y en la página www.stps.gob.mx',10,227+altura);
          doc.text('3/   Cursos impartidos por el área competente de la Secretaria del Trabajo y Previsión Social.',10,230+altura)
          doc.text('4/   Para empresas con menos de 51 trabajadores. Para empresas con más de 50 trabajadores firmaría el representante del patrón ante la ',10,233+altura)
          doc.text('Comisión mixta de capacitación, adiestramiento y productividad.',10,236+altura)
          doc.text('5/   Solo para empresas con más de 50 trabajadores.',10,239+altura);
          doc.text('* Dato no obligatorio.',10,242+altura)					
        
          const folioCreated =folioArray[0]+"-"+folioArray[1]+"-"+consecutivo.toString().padStart(3, '0');
          doc.text("Folio: ",170,205+altura)
          doc.setTextColor(255,0,0);
          doc.text(folioCreated,177,205+altura)
          consecutivo++
          registros[i].folio = folioCreated
          if (i !== registros.length - 1) {
            doc.addPage(); // Agregar una nueva página si se alcanza el límite de la página actual y no es el último objeto
          }
          doc.setTextColor(0, 0, 0);

        }

        doc.save('formato.pdf')
      })
    } catch (error) {
      console.log(error);
    } finally {
      generatingPDF.value = false;
    }
  }

  function gethalf(texto,fontsize,docWidth, scale){
    var textWidth = texto * fontsize / scale;
  
    var textX = (docWidth - textWidth) / 2;
    return textX
  }

  return {
    generatingPDF,
    generatePDF,
  };
}