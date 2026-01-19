// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;
//*====================================(d)====================================*/
uniform float orbRadius; // Radius of the orb for deformation
//*====================================(d)====================================*/
// This is a "varying" variable and interpolated between vertices and across fragments.
// The shared variable is initialized in the vertex shader and passed to the fragment shader.
out float intensity;
//*====================================(c)====================================*/
out vec3 vWorldPosition; // output world position of the vertex for distance calculation
//*====================================(c)====================================*/


void main() {

    //*====================================(b)====================================*/
    /*
    Pre:
      position: vertex position in model space
      normal: vertex normal in model space
      modelMatrix: model space to world space transformation matrix
      normalMatrix: inverse transpose of modelMatrix
    */
    // Calculate the world position of this vertex
    // Directly assign to out variable since we need it for both lighting (b) and proximity (c)
    vec3 OriginalPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    // Calculate the light direction vector from the vertex to the orb position
    vec3 lightVector = orbPosition - OriginalPosition;
    // Normalize the light vector
    vec3 lightDirection = normalize(lightVector);
    float lightDistance = length(lightVector);
    float attenuation = 1.0 / (1.0 + 0.005 * lightDistance * lightDistance); 
    // Calculate the intensity of the light
    /*
    Formula:
    N * L = |N| * |L| * cos(theta)
    where:
    N = normal vector
    L = light direction vector
    theta = angle between N and L
    |N| = magnitude of N
    |L| = magnitude of L
    cos(theta) = cosine of the angle between N and L
    intensity = dot product of N and L = |N| * |L| * cos(theta)
              = nx * lx + ny * ly + nz * lz
    */
    // Transform the normal from model space to world space
    // Use normalMatrix (provided by Three.js) which is the inverse transpose of modelMatrix
    // This correctly handles non-uniform scaling
    //  Get Normal Vector in World Space
    // or we can get normal manually by using the inverse transpose of modelMatrix
    // vec3 worldNormal = normalize(inverse(transpose(mat3(modelMatrix))) * normal);
    vec3 worldNormal = normalize(normalMatrix * normal);
    
    // Calculate the intensity using dot product
    // The Reason we use abs is to ensure the back faces are not negative values.
    intensity = abs(dot(worldNormal, lightDirection));
    // or
    // intensity = abs(worldNormal.x * lightDirection.x + worldNormal.y * lightDirection.y + worldNormal.z * lightDirection.z);
    
    // Clamp intensity to [0, 1] to avoid negative values (back faces)
    // min is make sure use intensity is not greater than 1.0 and not less than 0.0
    // max is make sure use intensity is not less than 0.0
    intensity = max(intensity * attenuation, 0.0);
    //*====================================(b)====================================*/
    
    //*====================================(d)====================================*/
    // Deformation: attract vertices toward the orb when it gets too close (magnetic effect)
    // Calculate distance from vertex to orb
    float distanceToOrb = lightDistance;

    bool isAttracting = true;
    
    // Define deformation range (when orb gets within this distance, start deforming)
    float deformationRange = orbRadius + 3.0; // Start deforming when orb is 3 units beyond its radius
    
    // Calculate deformation factor (0 = no deformation, 1 = full deformation)
    // More deformation as orb gets closer to the vertex
    // Smooth deformation: use smoothstep for smooth transition
    // When distance = orbRadius, factor = 1.0 (full deformation)
    // When distance = deformationRange, factor = 0.0 (no deformation)
    float deformationFactor = (distanceToOrb < deformationRange && distanceToOrb > 0.0) ? 1.0 - smoothstep(orbRadius, deformationRange, distanceToOrb) : 0.0;
    
    // Calculate deformation amount (how much to attract the vertex toward the orb)
    // Attract vertex toward orb center along the direction from vertex to orb
    float attractionStrength = 1.2; // Adjust this value to control deformation strength
    float attractionDistance = deformationFactor * attractionStrength;
    
    // Deform the position: attract vertex toward orb (magnetic effect)
    // If deformationFactor is greater than 0.0, attract the vertex toward the orb
    // lightDirection points from vertex to orb, so adding it moves vertex toward orb
    vec3 deformedWorldPosition = deformationFactor > 0.0 ? OriginalPosition + (isAttracting ? lightDirection : -lightDirection) * attractionDistance : OriginalPosition;
    
    // Use deformed position for world position (needed for fragment shader proximity detection)
    vWorldPosition = deformedWorldPosition;
    //*====================================(d)====================================*/
    //*====================================(c)====================================*/
    // Note: vWorldPosition is set above for deformation (d) and used in fragment shader for (c)
    // vWorldPosition = OriginalPosition;
    //*====================================(c)====================================*/
    // Transform deformed world position directly to clip space
    // We already have world position, so we only need view and projection matrices
    gl_Position = projectionMatrix * viewMatrix * vec4(deformedWorldPosition, 1.0);;
    
}
