var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var crowlRouter = express.Router();

crowlRouter.route('/')
    .get(function (req, res) {
        res.redirect('/crowl');
    });


crowlRouter.route('/crowl')
    .get(function (req, res) {
        try {
            res.render('index', { productlist: [], txtValue: '', pageSize: 1, pageCount: 1, currentPage: 1, resultText: "Result 0 - 0 of 0", msg: "" });
        }
        catch (err) {
            console.log(err);
        }
    })
    .post(function (req, res) {
        console.log(req.body);

        url = 'http://www.shopping.com/products~PG-' + req.body.txtcurrentpage + '?KW=' + req.body.txtQuery1;

        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var ttlresult;
                var products = [];

                var pageSize = 40,
                    pageCount = 80 / 40,
                    currentPage = req.body.txtcurrentpage, totalResult = 0;

                $('#searchResultsContainer').filter(function () {
                    var data = $(this);
                    ttlresult = data.children().first().children();

                    totalResult = $('.numTotalResults').text().split('of')[1].trim();
                    if (totalResult == "1500+")
                        totalResult = 1500;

                    pageCount = Math.ceil(totalResult / 40);

                    console.log(totalResult);

                    for (var i = 1; i < ttlresult.length; i++) {

                        var productobj = { productImage: "", productName: "", price: "" };

                        var pname = $('#nameQA' + i).attr('title');
                        productobj.productName = pname.length > 28 ? pname.substring(0, 28) : pname;
                        //productobj.price = $('#DCTmerchNameLnk' + i).text();

                        var priceraw = $('#quickLookItem-' + i).find('.productPrice').find('a').text();
                        priceraw = priceraw == '' ? $('#quickLookItem-' + i).find('.productPrice').text() : priceraw;
                        productobj.price = priceraw.replace(/(\r\n|\n|\r)/gm, '');

                        var img = '';
                        if ($('#quickLookItem-' + i).find('.placeholderImg').text() == '') {
                            img = $('#quickLookItem-' + i).find('img').attr('src');
                        }
                        else {
                            img = $('#quickLookItem-' + i).find('.placeholderImg').text();
                        }
                        productobj.productImage = img;

                        products.push(productobj);

                    } // for loop ends here 


                });

                var resultText = "";
                var msg = "";

                if (currentPage <= pageCount)
                    resultText = " Result " + (parseInt(currentPage - 1) * 40 + parseInt(1)) + " - " + (currentPage == pageCount ? totalResult : (currentPage) * 40) + " of " + totalResult;
                else
                    msg = "No Items found";

                res.render('index', { productlist: products, txtValue: req.body.txtQuery1, pageSize: 40, pageCount: pageCount, currentPage: currentPage, resultText: resultText, msg: msg });

            }
        });

    });



module.exports = crowlRouter;
