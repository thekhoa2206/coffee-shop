package com.hust.coffeeshop.common;

public class PrintSample {
    public static String CONTENT_HTML = "<div style=\"width: 100%;float: left;font-family:Arial,sans-serif;font-size:13px;padding-bottom: 20px;border-bottom: 1px solid #7a7676;margin-bottom: 20px;display:flex\">\n" +
            "<div style=\"width: 30%;float: left;\">&nbsp;</div>\n" +
            "\n" +
            "<div style=\"width: 35%;float: left;padding-left:10px\">\n" +
            "<div style=\"padding-bottom: 10px;font-weight: 600;\">{store_name}</div>\n" +
            "\n" +
            "<div style=\"padding-bottom: 10px;font-weight: 600;\">{store_address}</div>\n" +
            "\n" +
            "<div style=\"padding-bottom: 10px;font-weight: 600;\">{store_phone_number}</div>\n" +
            "\n" +
            "<div style=\"padding-bottom: 10px;font-weight: 600;\">{store_email}</div>\n" +
            "</div>\n" +
            "\n" +
            "<div style=\"width: 35%;float: right;\">\n" +
            "<div style=\"text-align: right;padding-bottom: 10px;\">Mã đơn hàng: <span style=\"font-weight: 600\">{order_code}</span></div>\n" +
            "\n" +
            "<div style=\"text-align: right;padding-bottom: 10px;\">Ngày tạo: <span style=\"font-weight: 600\">{created_on}</span></div>\n" +
            "</div>\n" +
            "</div>\n" +
            "\n" +
            "<div style=\"width: 100%\">\n" +
            "<h1 style=\"font-family:Arial,sans-serif;font-size:22px;text-align: center;padding-top: 10px;\">Đơn hàng</h1>\n" +
            "</div>\n" +
            "\n" +
            "<table style=\"width:100%;margin: 0 0 20px;\">\n" +
            "\t<tbody style=\"font-family:Arial,sans-serif;font-size:13px;\">\n" +
            "\t\t<tr>\n" +
            "\t\t\t<td style=\"width: 35%;\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 35%;\">&nbsp;</td>\n" +
            "\t\t\t<td>&nbsp;</td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr>\n" +
            "\t\t\t<td style=\"padding-bottom: 10px;\"><span style=\"font-weight: 600;\">Hóa đơn đến:</span></td>\n" +
            "\t\t\t<td style=\"padding-bottom: 10px;\"><span style=\"font-weight: 600;\">Giao hàng đến:</span></td>\n" +
            "\t\t\t<td style=\"text-align: right;padding-bottom: 10px;\">Điện thoại: <span style=\"font-weight: 600\">{customer_phone_number}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr>\n" +
            "\t\t\t<td style=\"padding-bottom: 10px;\">{customer_name}</td>\n" +
            "\t\t\t<td style=\"padding-bottom: 10px;\">{customer_name}</td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr>\n" +
            "\t\t\t<td style=\"padding-right: 20px;line-height: 20px;\">{customer_address} - {customer_ward} - {customer_district} - {customer_city}</td>\n" +
            "\t\t\t<td style=\"padding-right: 20px;line-height: 20px;\">{customer_address} - {customer_ward} - {customer_district} - {customer_city}</td>\n" +
            "\t\t\t<td>&nbsp;</td>\n" +
            "\t\t</tr>\n" +
            "\t</tbody>\n" +
            "</table>\n" +
            "\n" +
            "<table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%;border-left: 1px solid #7a7676;border-top: 1px solid #7a7676\">\n" +
            "\t<tbody>\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 12px;font-weight: 600\">\n" +
            "\t\t\t<td style=\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%;\"><span>STT </span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\"><span>Tên sản phẩm </span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\"><span>Số lượng </span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\"><span>Đơn giá </span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676;\"><span>Thành tiền </span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<!--<#assign lines = model.orderLineItems>--><!--<#list lines as line>-->\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 12px\">\n" +
            "\t\t\t<td style=\"padding: 1%; text-align: center;border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; width: 10%; height: 1px; vertical-align: middle;\"><span>{line_stt}</span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 20%; text-align: left; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; height: 1px; vertical-align: middle;\"><span>{line_product_name}</span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 10%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; height: 1px; vertical-align: middle;\"><span>{line_quantity}</span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; height: 1px; vertical-align: middle;\"><span>{line_price}</span></td>\n" +
            "\t\t\t<td style=\"padding: 1%; width: 15%; text-align: right; border-bottom:1px solid #7a7676;border-right:1px solid #7a7676; height: 1px; vertical-align: middle;\"><span>{line_amount}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<!--</#list>-->\n" +
            "\t</tbody>\n" +
            "</table>\n" +
            "\n" +
            "<table style=\"width:100%\">\n" +
            "\t<tbody>\n" +
            "\t\t<tr>\n" +
            "\t\t\t<td style=\"width: 50%;\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 50%;\">&nbsp;</td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 13px;\">\n" +
            "\t\t\t<td style=\"width: 50%;padding:1%\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;\">Tổng số lượng<span style=\"float: right;\">{total_quantity}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 13px;\">\n" +
            "\t\t\t<td style=\"width: 50%;padding: 1%\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;\">Tổng Tiền<span style=\"float: right;\">{total_amount}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 13px;\">\n" +
            "\t\t\t<td style=\"width: 50%;padding:1%\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 50%;border-bottom: 1px solid #7a7676;padding: 10px;\">Tổng COD<span style=\"float: right;\">{discount}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t\t<tr style=\"font-family:Arial,sans-serif;font-size: 13px;\">\n" +
            "\t\t\t<td style=\"width: 50%;padding:1%\">&nbsp;</td>\n" +
            "\t\t\t<td style=\"width: 50%;font-weight: 600;padding: 10px;\">Khách phải trả<span style=\"float: right;\">{total}</span></td>\n" +
            "\t\t</tr>\n" +
            "\t</tbody>\n" +
            "</table>\n" +
            "\n" +
            "<footer style=\"page-break-after: always\">.</footer>\n";
}

