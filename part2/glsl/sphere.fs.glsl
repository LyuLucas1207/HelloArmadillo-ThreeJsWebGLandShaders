uniform vec3 orbColor; // Color for the orb

void main() {
 	// TODO: Set final rendered color here
  	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red
	gl_FragColor = vec4(orbColor, 1.0);
}
