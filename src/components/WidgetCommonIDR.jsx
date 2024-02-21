const WidgetCommonIDR = ({value}) => {
    return <>{value ? value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'}): 0}</>
    // return <>{value}</>
  }
  
  export default WidgetCommonIDR;