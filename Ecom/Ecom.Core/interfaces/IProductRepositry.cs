﻿
using Ecom.Core.Entities.Product;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecom.Core.interfaces
{
    public interface IProductRepositry : IGenericRepositry<Product>
    {
        //// for futuer
        //Task<IEnumerable<ProductDTO>> GetAllAsync(ProductParams productParams);
        //Task<bool> AddAsync(AddProductDTO productDTO);
        //Task<bool> UpdateAsync(UpdateProductDTO updateProductDTO);
        //Task DeleteAsync(Product product);
    }
}
