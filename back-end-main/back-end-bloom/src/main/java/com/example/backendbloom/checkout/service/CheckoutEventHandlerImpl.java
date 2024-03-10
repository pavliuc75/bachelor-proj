package com.example.backendbloom.checkout.service;

import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.ProductInOrderModel;
import com.example.backendbloom.user.model.order.ShippingDetailsModel;
import com.example.backendbloom.user.service.order.OrderService;
import com.stripe.exception.StripeException;
import com.stripe.model.Address;
import com.stripe.model.Event;
import com.stripe.model.LineItem;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionRetrieveParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutEventHandlerImpl implements CheckoutEventHandler {
    private final OrderService orderService;
    private final ProductService productService;

    @Override
    public void handleSessionCheckoutEvents(Event event) throws StripeException {
        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().get();
                SessionRetrieveParams params =
                        SessionRetrieveParams.builder()
                                .addExpand("line_items")
                                .addExpand("line_items.data.price.product")
                                .build();
                Session sessionWithLineItems = Session.retrieve(session.getId(), params, null);
                List<LineItem> lineItemList = sessionWithLineItems.getLineItems().getData();

                // Fulfill the order...
                List<ProductInOrderModel> productInCartModelList = mapProductInCartModelToProductInOrderList(lineItemList);
                String customerEmail = sessionWithLineItems.getCustomerEmail();
                ShippingDetailsModel shippingDetailsModel = buildShippingDetailsModel(sessionWithLineItems.getCustomerDetails().getAddress());
                orderService.fulfillOrder(customerEmail, productInCartModelList, shippingDetailsModel);
                break;

        }
    }

    private ShippingDetailsModel buildShippingDetailsModel(Address address) {
        String city = address.getCity();
        String country = address.getCountry();
        String customerAddress = address.getLine1() +" " + address.getLine2();
        String postalCode = address.getPostalCode();
        return new ShippingDetailsModel(city,country, customerAddress, postalCode);
    }
    private List<ProductInOrderModel> mapProductInCartModelToProductInOrderList(List<LineItem> lineItems) {
        List<ProductInOrderModel> productInOrderList = new ArrayList<>();
        for (LineItem item : lineItems) {
            ProductModel productModel =  productService.getProductById(item.getPrice().getProductObject().getMetadata().get("product_id"));
            ProductInOrderModel product = new ProductInOrderModel();
            product.setId(productModel.getId());
            product.setName(productModel.getName());
            product.setPrice(computeStripeItemPrice(item.getPrice().getUnitAmountDecimal()));
            product.setDescription(productModel.getDescription());
            product.setMainImage(productModel.getMainImage());
            product.setAmount(Math.toIntExact(item.getQuantity()));
            product.setOrderStatus(OrderStatusModel.AWAITING_SHIPMENT);
            productInOrderList.add(product);
        }
        return productInOrderList;
    }

    private BigDecimal computeStripeItemPrice(BigDecimal price) {
//      Stripe stores value the following way, if the real price is 122, stripe stores is as 12200 - 00 accounts for cents
        BigDecimal hundred = new BigDecimal(100);
        return price.divide(hundred, RoundingMode.HALF_UP);
    }
}
