using Front.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using static Back.Models.Bill;
using static Back.Models.Reply;
using System.Text;
using static Back.Models.Parametric;

namespace Front.Controllers
{
    public class SearchBillController : Controller
    {
        private readonly ILogger<SearchBillController> _logger;
        string api = "https://localhost:7228/";

        public SearchBillController(ILogger<SearchBillController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<object> GetBills([FromBody] BillFilter data)
        {
            // Crear una instancia de HttpClient
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    List<BillFound> Bills = new List<BillFound>();
                    ReplyLogin reply = new ReplyLogin();
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

                    // URL del servicio externo
                    var urlServicio = api + "api/GetBills";

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
                        Bills = JsonConvert.DeserializeObject<List<BillFound>>(reply.Data.ToString());
                        
                    }
                    return Bills;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

    }
}