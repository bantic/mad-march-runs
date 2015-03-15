export default function(error){
  if (error.message) { return error.message; }
  if (error.responseJSON && error.responseJSON.error) {
    return error.responseJSON.error;
  }
  if (error.responseText) {
    return error.responseText;
  }

  return 'unknown error: ' + error;
}
