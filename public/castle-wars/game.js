document.addEventListener('keydown', (event) => {
  switch (event.key) {
      case 'w':
          leftCastle.adjustAngle(true); // Increase left castle angle
          break;
      case 's':
          leftCastle.adjustAngle(false); // Decrease left castle angle
          break;
      case 'o':
      case 'O':
          rightCastle.adjustAngle(true); // Increase right castle angle
          break;
      case 'l':
      case 'L':
          rightCastle.adjustAngle(false); // Decrease right castle angle
          break;
      case 'q':
          leftCastle.fireProjectile(rightCastle); // Fire from left castle
          break;
      case 'p':
          rightCastle.fireProjectile(leftCastle); // Fire from right castle
          break;
  }
  drawCastles(); // Redraw castles and trajectory lines with updated angles
});

