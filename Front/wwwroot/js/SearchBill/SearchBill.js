let chkClient = document.getElementById('chkClient'); // chekbox para buscar por cliente
let chkBillNumber = document.getElementById('chkBillNumber');// chekbox para buscar por numero de factura
let sltClientSearch = document.getElementById('sltClientSearch'); // select de clientes
let txtNumberBillSearch = document.getElementById('txtNumberBillSearch'); // campo para numero de factura
let tbodyBills = document.getElementById('tbodyBills'); // contenido de tabla para facturas encontradas
let btnSearchBill = document.getElementById('btnSearchBill'); // boton para buscar facturas

$(document).ready(async function(){
    await Get('/Bill/GetClients').then(function(data){
        parametricSelect(data, sltClientSearch);
    });
});

chkClient.addEventListener('change', function(){
    if(chkClient.checked){
        sltClientSearch.value=0;
        txtNumberBillSearch.value='';
        chkBillNumber.checked = false;
        sltClientSearch.disabled = false;
        txtNumberBillSearch.disabled =true;
        return
    }
    sltClientSearch.value=0;
    txtNumberBillSearch.value='';
    chkBillNumber.checked = true;
    sltClientSearch.disabled = true;
    txtNumberBillSearch.disabled =false;
    
    
})

chkBillNumber.addEventListener('change', function(){
    if(chkBillNumber.checked){
        sltClientSearch.value=0;
        txtNumberBillSearch.value='';
        chkClient.checked = false;
        sltClientSearch.disabled = true;
        txtNumberBillSearch.disabled =false;
        return
    }
    sltClientSearch.value=0;
    txtNumberBillSearch.value='';
    chkClient.checked = true;
    sltClientSearch.disabled = false;
    txtNumberBillSearch.disabled =true;
    
    
})

btnSearchBill.addEventListener('click', function(){
    let jsonSend = {
        'BillNumber':0,
        'IdClient':0
    }
    if(chkBillNumber.checked){
        jsonSend.BillNumber = parseInt(txtNumberBillSearch.value);
    }else{
        jsonSend.IdClient = parseInt(sltClientSearch.value);  
    }
    tbodyBills.innerHTML='';
    SearchBills(jsonSend).then(function(response){
        if(response.length==0){
            $('#modalSearch').modal('show');
            return;
        }
        response.forEach(el => {
            tbodyBills.innerHTML +=`
            <tr>
                <td class='text-center'>
                    ${el.billNumber}
                </td>
                <td class='text-center'>
                    ${el.emisionDateBill}
                </td>
                <td class='text-center'>
                    ${el.totalInvoiced}
                </td>
            </tr>`;
        });
    })
});


function SearchBills(data){
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'SearchBill/GetBills',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data), 
            success: function(response) {
                resolve(response)
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}