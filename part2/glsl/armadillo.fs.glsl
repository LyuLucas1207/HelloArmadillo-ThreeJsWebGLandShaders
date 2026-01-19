// The value of the "varying" variable is interpolated between values computed in the vertex shader
// The varying variable we passed from the vertex shader is identified by the 'in' classifier
in float intensity;
//*====================================(c)====================================*/
in vec3 vWorldPosition; // World position of the fragment for distance calculation
uniform vec3 orbPosition; // Position of the orb sphere
uniform float orbRadius; // Radius of the orb sphere
//*====================================(c)====================================*/

void main() {
	// TODO: Set final rendered colour to intensity (a grey level)
    // gl_FragColor = vec4(intensity*vec3(0.75, 0.75, 0.75), 1.0); 
 	// Set final rendered colour to intensity (a grey level)
	vec3 baseColor = intensity * vec3(1.0, 1.0, 1.0);
	vec3 cyanColor = intensity * vec3(0.0, 1.0, 1.0);

	//*====================================(c)====================================*/
	// Proximity detection: check if fragment is within proximity distance of the orb
	// Calculate distance from fragment to orb center
	float distanceToOrb = length(vWorldPosition - orbPosition);
	
	// Define proximity threshold (orb radius + some extra distance for detection)
	float proximityThreshold = orbRadius + 1.6; // Adjust this value to control detection range
	
	// If within proximity, set color to cyan (0, 1, 1)
	gl_FragColor = distanceToOrb < proximityThreshold ? vec4(cyanColor, 0.8) : vec4(baseColor, 1.0);



	// Calculate blend factor based on distance (smooth transition)
	// Or we can use the smoothstep function to calculate the blend factor
	// 
	// float blendFactor = distanceToOrb < proximityThreshold ? 1.0 - smoothstep(orbRadius, proximityThreshold, distanceToOrb) * 0.2 : 0.0;
	// gl_FragColor = vec4(mix(baseColor, cyanColor, blendFactor), 1.0);
	//*====================================(c)====================================*/
}
