using Back.Models;
using Front.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using static Back.Models.Bill;
using static Back.Models.Parametric;
using static Back.Models.Reply;

namespace Front.Controllers
{
    public class BillController : Controller
    {
        private readonly ILogger<BillController> _logger;
        string api = "https://localhost:7228/";
        public BillController(ILogger<BillController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<object> GetClients()
        {
            // Crear una instancia de HttpClient
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    ReplyLogin reply = new ReplyLogin();
                    List<DefaultClass> clients = new List<DefaultClass>();
                    // Hacer una solicitud GET a la API externa
                    HttpResponseMessage response = await client.GetAsync(api + "api/GetClients");

                    // Verificar si la solicitud fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        // Leer el contenido de la respuesta
                        string jsonString = await response.Content.ReadAsStringAsync();

                        // Convierte la respuesta JSON a un objeto
                        reply  = JsonConvert.DeserializeObject<ReplyLogin>(jsonString);
                        clients = JsonConvert.DeserializeObject<List<DefaultClass>>(reply.Data.ToString());

                    }
                    return clients;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public async Task<object> GetProducts()
        {
            // Crear una instancia de HttpClient
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    ReplyLogin reply = new ReplyLogin();
                    List<Products> Products = new List<Products>();
                    // Hacer una solicitud GET a la API externa
                    HttpResponseMessage response = await client.GetAsync(api + "api/GetProducts");

                    // Verificar si la solicitud fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        // Leer el contenido de la respuesta
                        string jsonString = await response.Content.ReadAsStringAsync();

                        // Convierte la respuesta JSON a un objeto
                        reply = JsonConvert.DeserializeObject<ReplyLogin>(jsonString);
                        Products = JsonConvert.DeserializeObject<List<Products>>(reply.Data.ToString());

                    }
                    return Products;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        [HttpPost]
        public async Task<object> SaveBill([FromBody] BillModel data)
        {
            // Crear una instancia de HttpClient
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    ReplyLogin reply = new ReplyLogin();
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

                    // URL del servicio externo
                    var urlServicio = api + "api/SaveBill";

                    // Crear la solicitud POST al servicio externo
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    // Realizar la solicitud POST al servicio externo
                    var response = await client.PostAsync(urlServicio, content);

                    // Verificar si la solicitud fue exitosa
                    if (response.IsSuccessStatusCode)
                    {
                        // Leer la respuesta del servicio
                        string jsonString = await response.Content.ReadAsStringAsync();

                        // Convierte la respuesta JSON a un objeto
                        reply = JsonConvert.DeserializeObject<ReplyLogin>(jsonString);
                        return reply.Flag;
                    }
                    else
                    {
                        // Manejar la respuesta si la solicitud no fue exitosa
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }


    }
}