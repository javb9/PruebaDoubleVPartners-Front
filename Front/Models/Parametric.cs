using System.Reflection;

namespace Back.Models
{
    public class Parametric
    {
        public class DefaultClass
        {
            public int Id { get; set;}
            public string Name { get; set;} 
        }

        public class Products
        {
            public int IdProduct { get; set;}   
            public string ProductName { get; set;}
            public string ProductImage { get; set;}
            public decimal UnitPriceProduct {get; set;}
        }
    }
}
