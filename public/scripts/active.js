$(() => {
    const dataCat = $('.mainCategory').find('ul').attr('data-catactive');
    const dataSubCat = $('.subCategory').find('ul').attr('data-subcatactive')

    $.each($('.mainCategory').find('li'), (i, val) => {
        if($(val).children().text() === dataCat){
            $('.catActive').css({left:`${$('.catActive').width() * i}px`})
        }
    })

    $.each($('.subCategory').find('li'), (i, val) => {
        if($(val).children().text() === dataSubCat){
            $(val).children().css({color:"rgb(248, 245, 130)"})
        }
    })
})