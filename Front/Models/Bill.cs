namespace Back.Models
{
    public class Bill
    {
        public class BillModel
        {
            public int IdBill { get; set; } 
            public int IdClient { get; set; }
            public int BillNumber { get; set; }
            public int TotalArticles { get; set;}
            public decimal SubTotalInvoiced { get; set; }
            public decimal TtotalTax { get; set; }
            public decimal TotalInvoiced { get; set; }
            public List<BillDetail> BillDetail { get; set; }
        }

        public class BillDetail
        {
            public int IdProduct { get; set; }
            public int Amount { get; set; }
            public decimal SubTotal { get; set; }
            public decimal UnitPrice { get; set; }
        }
        public class BillFilter
        {
            public int BillNumber { get; set; }
            public int IdClient { get; set; }
        }

        public class BillFound
        {
            public int BillNumber { get; set; }
            public string EmisionDateBill { get; set; }
            public decimal TotalInvoiced { get; set; }
        }
    }
}
