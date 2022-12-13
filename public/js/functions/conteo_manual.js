let serial = document.getElementById("serial")
let parte = document.getElementById("parte")
let cantidad = document.getElementById("cantidad")
let cantidad2 = document.getElementById("cantidad2")
let grupo= document.getElementById("ca")
let ubicacion= document.getElementById("ub")
let nombre= document.getElementById("no")
let obsoleto= document.getElementById("obsoleto")
let btnCerrarSuccess= document.getElementById("btnCerrar_success")
let btnCerrarError= document.getElementById("btnCerrar_error")
let cambiarUbicacion= document.getElementById("cambiarUbicacion")
let rack= document.getElementById("rack")
let storage_location= document.getElementById("storage_location")

serial.addEventListener('change', function (evt) {


        if (serial.value.charAt(0) == "S" && Number.isInteger(parseInt(serial.value.substr(1)))) {
            serial.value= serial.value.substr(1)
            
            serialFunction()
        }else{

            soundWrong()
              $('#serialWarning').removeAttr('hidden')
              $('#serialWarning2').text('Incorrecto')
              $('#serialWarning2').removeAttr('hidden')
              $('#serial').val('')
        }
        
    
});

function serialFunction() {

    data = { "serial": `${serial.value}` }
    axios({
      method: 'post',
      url: `/revisarSerial`,
      data: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })
      .then((result) => {

        let data= result.data
        let foto= data[0]
        let capturado = data[1]

        if(capturado.length>0){
            soundWrong()
              $('#serialWarning').removeAttr('hidden')
              $('#serialWarning2').text('Serial Duplicado')
              $('#serialWarning2').removeAttr('hidden')
              $('#serial').val('')
        }else{
            soundOk()
            $('#serialWarning').prop('hidden', true)
            $('#serialWarning2').prop('hidden', true)
            if(foto.length>0){
                obsoleto.value=0
            }else
            {
                obsoleto.value=1
                $('#modalError').modal({ backdrop: 'static', keyboard: false })
            }
            
            parte.focus()
        }




    })
    .catch((err) => { console.error(err) })


}

parte.addEventListener('change', function (evt) {


        if (parte.value.charAt(0) == "P") {
            parte.value= parte.value.substr(1)
            $('#parteWarning').prop('hidden', true)
            $('#parteWarning2').prop('hidden', true)
            soundOk()
            cantidad.focus()
        }else{

            soundWrong()
              $('#parteWarning').removeAttr('hidden')
              $('#parteWarning2').text('Incorrecto')
              $('#parteWarning2').removeAttr('hidden')
              $('#parte').val('')
        }
        
    
});



cantidad.addEventListener('change', function (evt) {


    if (cantidad.value.match(/[^0-9]/)) {

        $('#cantidadWarning').removeAttr('hidden')
        $('#cantidadWarning2').text('Cantidad Incorrecta')
        $('#cantidadWarning2').removeAttr('hidden')
        $('#cantidad').val('')
        soundWrong()

    } else {
        cantidad2.focus()
        $('#cantidadWarning').prop('hidden', true)
        $('#cantidadWarning2').prop('hidden', true)
        soundOk()

    }


});


cantidad2.addEventListener('keypress', function (evt) {

    let serialValue = serial.value
    let parteValue = parte.value
    let cantidadValue = cantidad.value
    let cantidad2Value = cantidad2.value

    if (evt.which == 13) {

        if (cantidad2.value.match(/[^0-9]/)) {
            $('#cantidadWarningv').removeAttr('hidden')
            $('#cantidadWarningv2').text('Cantidad Incorrecta')
            $('#cantidadWarningv2').removeAttr('hidden')
            $('#cantidad2').val('')
            soundWrong()

        }else{

            if (cantidadValue != cantidad2Value) {

                $('#cantidadWarningv').removeAttr('hidden')
                $('#cantidadWarningv2').text('Cantidad Incorrecta')
                $('#cantidadWarningv2').removeAttr('hidden')
                $('#cantidad2').val('')
                soundWrong()
    
            } else {
                $('#cantidadWarningv').prop('hidden', true)
                $('#cantidadWarningv2').prop('hidden', true)
                soundOk()
    
            }

        }



        if (serialValue != "" && parteValue != "" && cantidadValue != "" && (cantidadValue == cantidad2Value)) {
            soundOk()

            data = { "serial": `${serialValue}`, "parte": `${parteValue}`, "cantidad": `${cantidadValue}`, "grupo": `${grupo.value}`, "ubicacion": `${ubicacion.value}`, "obsoleto": `${obsoleto.value}`, "rack": `${rack.value}`, "storage_location": `${storage_location.value}`,"nombre": `${nombre.value}` }
            axios({
                method: 'post',
                url: `/insertConteoManual`,
                data: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
                .then((result) => {

                    if (result.status == 200) {

                        let color
                        if (obsoleto.value == 1) {
                            color = "danger"
                        } else {
                            color = "success"
                        }

                        let addSpan = `<h6 style="display:inline; "><span class="badge badge-${color} fspan">${serialValue}</span></h6> `
                        $('#cardCapturado').append(addSpan)

                        serial.value = ""
                        parte.value = ""
                        cantidad.value = ""
                        cantidad2.value = ""
                        obsoleto.value = ""
                        $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
                        serial.focus()
                    }





                })
                .catch((err) => { console.error(err) })



        }

    }


});


$(document).ready(function () {

    soundOk()
    serial.focus()
})





$("#modalError").on("hidden.bs.modal", function () {
    parte.focus()
    
})

$("#modalSuccess").on("hidden.bs.modal", function () {
    serial.focus()
})


