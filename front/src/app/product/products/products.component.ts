import { Component, OnInit } from '@angular/core';
import { Product } from "../product.model";
import { SelectItem } from "primeng/api";
import { SnackbarService } from "../../shared/utils/snackbar/snackbar.service";
import { PaginationEvent } from "../../shared/ui/list/list.component";
import { ProductService } from "../product.service";
import { DEFAULT_SEARCH_PARAMS, SearchParams } from "../../shared/ui/list/search.model";
import { SearchService } from "../../shared/ui/list/search.service";

const DEFAULT_PRODUCT_SEARCH_PARAMS: SearchParams = { ...DEFAULT_SEARCH_PARAMS, sortField: 'id' }

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = []
  totalProducts: number = 0
  sortOptions: SelectItem[];

  constructor(private snackbarService: SnackbarService, private productService: ProductService, private searchService: SearchService) {
    this.sortOptions = [
      { label: 'Name ▲', value: 'asc-name' },
      { label: 'Name ▼', value: 'desc-name' },
      { label: 'Price ▲', value: 'asc-price' },
      { label: 'Price ▼', value: 'desc-price' },
      { label: 'Rating ▲', value: 'asc-rating' },
      { label: 'Rating ▼', value: 'desc-rating' },
      { label: 'Category', value: 'asc-category' },
      { label: 'Availability', value: 'desc-quantity' },
    ]
  }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.productService.getAll(DEFAULT_PRODUCT_SEARCH_PARAMS)
      .subscribe(response => {
        this.products = response._embedded.productDTOList
        this.totalProducts = response.page.totalElements
      })

  }

  updateProductList(event: PaginationEvent): void {
    this.productService.getAll(this.searchService.formatSearchFilter({ ...DEFAULT_PRODUCT_SEARCH_PARAMS, ...event }))
      .subscribe(response => {
        this.products = response._embedded.productDTOList
        this.totalProducts = response.page.totalElements
      })
  }

  addToCart(product: Product): void {
    this.snackbarService.displaySuccess(`Product [${ product.name }] added to your cart!`)
    setTimeout(() => this.snackbarService.displayInfo('Well... In theory. There is no cart yet ☹️'), 2000)
  }

  protected readonly Math = Math
}
