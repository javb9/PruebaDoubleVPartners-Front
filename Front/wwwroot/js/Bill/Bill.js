let tbodyProducts = document.getElementById('tbodyProducts');//tabla prodcutos nuevos
let textDanger = document.getElementById('textDanger'); // etiqueta que guarda texto de fallo
//totales elemnetos
let liSubTotal = document.getElementById('liSubTotal');
let liTax = document.getElementById('liTax');
let liTotal = document.getElementById('liTotal');

let incrementProducts = 0;
let productsToBuy = [];



async function GetProducts(){
    let products=[];
    let prod=[];
        await Get('/Bill/GetProducts').then(function(data){
        products =  data;
    });
    products.forEach(el=>{
        prod.push({
            'id' : el.idProduct,
            'name': el.productName
        })
    })
    return prod;
}

async function GetClients(){
    let clients = [];
    await Get('/Bill/GetClients').then(function(data){
        clients =  data;
    });
    return clients;
}


let TableProducts = $('#TableProducts').dxDataGrid({
    dataSource: [],
    keyExpr: 'ID',
    editing: {
      mode: 'batch',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
      selectTextOnEditStart: true,
      startEditAction: 'click',
    },
    columns: [
        {
            dataField: 'producto',
            caption: 'Producto',
            width: 125,
            lookup: {
              dataSource: GetProducts(),
              valueExpr: 'id',
              displayExpr: 'name'
            }
        },
      'Precio Unitario', 
      {
        dataField: 'Cantidad',
        width: 170,
      }, 
      "Total"
    ],
  }).dxDataGrid('instance');


let  lookupClients = $('#sltClient').dxLookup({
    dataSource: [],
    valueExpr: 'id',
    displayExpr: 'name',
    placeholder: 'Seleccione Cliente',
    dropDownOptions: {
      showTitle: false,
    },
    inputAttr: {
      'aria-label': 'Simple lookup',
    },
    onInitialized: async function(e) {
        let client = await GetClients();
        e.component.option("dataSource", client);
    }
  }).dxLookup("instance");

  let NumberBill = $('#txtNumberBill').dxNumberBox({
    value: undefined,
    max: 99999999999999999,
    placeholder:"Numero Factura",
    inputAttr: { 'aria-label': 'txtNumberBill' }
  }).dxNumberBox("instance");


$('#btnNewBill').dxButton({
    stylingMode: 'contained',
    text: 'Nueva',
    type: 'default',
    width: 120,
    onClick() {
        CleanForm();
    },
  });

  $('#btnAddProduct').dxButton({
    stylingMode: 'contained',
    text: 'Agregar producto',
    type: 'default',
    width: 120,
    onClick() {
        incrementProducts++;
        // tbodyProducts.innerHTML +=`
        // <tr>
        //     <td>
        //         <select class="form-select sltProduct" aria-label="Default select example" id="sltProduct${incrementProducts}">
        //             <option value=0 selected>Producto</option>
        //         </select>
        //     </td>
        //     <td>
        //         <input type="number" class="form-control" id="txtUnitPrice${incrementProducts}" readonly>
        //     </td>
        //     <td>
        //         <input type="number" class="form-control txtAmount" id="txtAmount${incrementProducts}">
        //     </td>
        //     <td class='text-center'>
        //         <img src="" frameborder="0" height="80" id="img${incrementProducts}"></img>
        //     </td>
        //     <td>
        //         <input type="number" class="form-control" id="txtTotal${incrementProducts}" readonly>
        //     </td>
        // </tr>
        // `;

        products.forEach(el => {
            document.getElementById(`sltProduct${incrementProducts}`).innerHTML += `<option value='${el.idProduct}'>${el.productName}</option>`;
        });

        productsToBuy.push({
            'IdIncrement':incrementProducts,
            'Amount':0,
            'IdProduct': 0,
            'SubTotal':0,
            'UnitPrice':0
        })

        TableProducts.addRow({
            id: nuevoId,
            nombre: "Nuevo Elemento",
            cantidad: 0
            // Agrega más propiedades según sea necesario
          });

        productsToBuy.forEach(el=>{
            $(`#txtAmount${el.IdIncrement}`).val(el.Amount);
            $(`#txtUnitPrice${el.IdIncrement}`).val(el.UnitPrice);
            var total = parseInt($(`#txtUnitPrice${el.IdIncrement}`).val()) * parseInt($(`#txtAmount${el.IdIncrement}`).val());
            $(`#txtTotal${el.IdIncrement}`).val(total);
            $(`#sltProduct${el.IdIncrement}`).val(el.IdProduct);
        });

        $('.sltProduct').on('change', function (el) {
            var idProduct = el.currentTarget.id.replace('sltProduct', '');
            var product = productsToBuy.find(p=>p.IdIncrement == idProduct);
            var productStock = products.find(p=>parseInt(p.idProduct) == parseInt($(`#${el.currentTarget.id}`).val()))
            product.UnitPrice = productStock != undefined ? productStock.unitPriceProduct : 0;
            product.IdProduct = parseInt($(`#${el.currentTarget.id}`).val());
            $(`#txtUnitPrice${idProduct}`).val(product.UnitPrice);
            if($(`txtAmount${idProduct}`).val()!='' && $(`txtAmount${idProduct}`).val()!=0 && $(`txtAmount${idProduct}`).val()!='0'){
                var total = parseInt($(`#txtUnitPrice${idProduct}`).val()== '' ? 0 : $(`#txtUnitPrice${idProduct}`).val()) * parseInt($(`#txtAmount${idProduct}`).val() == '' ? 0 : $(`#txtAmount${idProduct}`).val());
                $(`#txtTotal${idProduct}`).val(total);
                product.SubTotal = total;
            }
            LoadTotals();
            if(productStock!=undefined){
                document.getElementById(`img${idProduct}`).setAttribute('src', productStock.productImage)
            }
        });

        $('.txtAmount').on('change', function (el) {

            var idProduct = el.currentTarget.id.replace('txtAmount', '');
            var total = parseInt($(`#txtUnitPrice${idProduct}`).val() == '' ? 0 : $(`#txtUnitPrice${idProduct}`).val()) * parseInt($(`#txtAmount${idProduct}`).val() == '' ? 0 : $(`#txtAmount${idProduct}`).val());
            $(`#txtTotal${idProduct}`).val(total);
            var product = productsToBuy.find(p=>p.IdIncrement == idProduct);
            product.Amount = parseInt($(`#txtAmount${idProduct}`).val());
            product.SubTotal = total;
            LoadTotals();
        })
    },
  });

  $('#btnSaveBill').dxButton({
    stylingMode: 'contained',
    text: 'Guardar',
    type: 'default',
    width: 120,
    async onClick() {
        if(await valdateFields()){
            textDanger.innerText="Debe tener todos los campos diligenciado y por lo menos un producto seleccionado.";
            $('#modal').modal("show");
            return;
        }
        let TotalAmount = 0;
        productsToBuy.forEach(el=>{
            TotalAmount = TotalAmount+ el.Amount;
        })
    
        let data = {
            'IdClient': parseInt(lookupClients.option("value")),
            'BillNumber':parseInt(NumberBill.option("value")),
            'TotalArticles':TotalAmount,
            'SubTotalInvoiced': parseFloat(liSubTotal.innerText),
            "TtotalTax": parseFloat(liTax.innerText),
            "TotalInvoiced": parseFloat(liTotal.innerText),
            "BillDetail": productsToBuy
        }
        console.log(data)
        $.ajax({
            url: 'Bill/SaveBill',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data), 
            success: function(response) {
                if(!response){
                    textDanger.innerText="El numero de factura coincide con uno ya registrado, debe ser diferente.";
                    $('#modal').modal("show");
                    return
                }
                CleanForm();
            },
            error: function(xhr, status, error) {
                console.error('Error al enviar los datos');
            }
        });
    },
  });




//#region  funciones

function CleanForm(){
    productsToBuy = [];
    incrementProducts = 0;
    tbodyProducts.innerHTML = '';
    liSubTotal.innerText = 0;
    liTax.innerText = 0;
    liTotal.innerText = 0;
    NumberBill.reset();
    lookupClients.reset();
}

function LoadTotals(){
    liSubTotal.innerText = 0;
    liTax.innerText = 0;
    liTotal.innerText = 0;
    productsToBuy.forEach(el=>{
        liSubTotal.innerText = parseInt(liSubTotal.innerText) + el.SubTotal;
        liTax.innerText = parseFloat(liTax.innerText) + (el.SubTotal * 0.19);
        liTotal.innerText = parseFloat(liTotal.innerText) + (el.SubTotal * 0.19) + el.SubTotal;
    });
}


function valdateFields(){
    if(productsToBuy.length==0){
        return true;
    }

    var validateSubtotal = productsToBuy.filter(p=>p.SubTotal == 0 || p.SubTotal == '')

    if(validateSubtotal != undefined && validateSubtotal != null && validateSubtotal.length!= 0){
        return true;
    }

    if(lookupClients.option('value') == null){
        return true;
    }
    if(NumberBill.option("value") == 0 || NumberBill.option("value")==null){
        return true;
    }
    return false;
}

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

//#endregion