/**
 * Converts a value matrix to a formatted string representation
 * @param {Array} vMatrix - The value matrix to convert
 * @returns {string} Formatted string representation of the matrix
 */
function matrixToString(vMatrix) {
  let matrixStr = "";
  let tempStr = "";
  for (const i in vMatrix) {
    for (const j in vMatrix[i]) {
      tempStr += vMatrix[i][j].toString();
      if (tempStr === "0") {
        tempStr += ".00";
      } else if (tempStr.length < 4) {
        tempStr += "0";
      } else {
        tempStr = tempStr.substring(0, 4);
      }
      matrixStr += tempStr;
      matrixStr += ", ";
      tempStr = "";
    }
    matrixStr += "\n ";
  }
  return matrixStr;
}

export { matrixToString };
