
function Get(url){
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                resolve(data); // Resuelve la promesa con los datos recibidos
            },
            error: function(xhr, status, error) {
                reject(error); // Rechaza la promesa en caso de error
            }
        });
    });
}

function parametricSelect(data, slt){
    data.forEach(el => {
        slt.innerHTML += `<option value='${el.id}'>${el.name}</option>`;
    });
}
