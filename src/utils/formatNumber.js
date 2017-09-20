function errorFor(phone) {
    return function(text) {
        throw new Error(`${ text } (${ phone })`)
    }
}

module.exports = function formatNumber( phone, strict = true ) {
    const error = errorFor(phone);

    if ( !phone ) return strict ? error('Введите номер') : false

    let formatted = phone.replace(/ /g,'')


    if ( formatted[0] === '+' && formatted[1] === '7' ) 
        formatted = formatted.replace('+7','')

    if ( formatted[0] === '8' &&  formatted.length > 6) 
        formatted = formatted.replace('8','')

    formatted = formatted.replace(/\D/g,'')

    if ( formatted.length > 10 ) return strict ? error('Лишние цифры в номере') : false
    if ( formatted.length < 10 && formatted.length > 6) return strict ? error('Слишком короткий номер') : false        

    // городской без кода
    if ( formatted.length === 6 ) formatted = `7212${ formatted }`

    return `+7${ formatted }`
}
