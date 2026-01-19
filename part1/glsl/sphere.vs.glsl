// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;

void main() {
    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position.
    // TODO: Make changes here to make the orb move as the light source
    //*====================================(a)====================================*/
    /*
    modelMatrix[column][row]
    modelMatrix = [
        [R*S, R*S, R*S, translationX],
        [R*S, R*S, R*S, translationY],
        [R*S, R*S, R*S, translationZ],
        [0, 0, 0, 1]
    ];
    This is Model Space to World Space transformation matrix
    */
    // Sphere original position
    vec3 modelOrigin = vec3(
        modelMatrix[0][3],  // The fourth element of the first row = translationX
        modelMatrix[1][3],  // The fourth element of the second row = translationY
        modelMatrix[2][3]   // The fourth element of the third row = translationZ
    );
    
    // Calculate the value change because of the keyboard input in world space
    vec3 valueChange = orbPosition - modelOrigin;
    
    // Convert the valueChange to model space
    // Get Transformation Matrix of Model Space to World Space
    mat3 rotationScale = mat3(modelMatrix);
    // Get Inverse of Transformation Matrix of Model Space to World Space
    // Which is World Space to Model Space transformation matrix
    mat3 inverseRotationScale = inverse(rotationScale);

    // Convert the valueChange to model space
    vec3 valueChangeInModelSpace = inverseRotationScale * valueChange;
    
    // Apply the valueChange adding to the original position in model space
    vec3 newPosition = position + valueChangeInModelSpace;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    //*====================================(a)====================================*/
}