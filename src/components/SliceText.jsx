const SliceText = ({ text, maxLength }) => {
    if (text && text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };
  
  export default SliceText;