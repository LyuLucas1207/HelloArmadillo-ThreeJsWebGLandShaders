// Glove vertex shader: Gouraud lighting from orb, deformation (d), pass data for proximity (c)
uniform vec3 orbPosition;
uniform float orbRadius;

out float vLightIntensity;
out vec3 vWorldSpacePosition;
out vec2 vTextureCoordinate;

void main() {
    vTextureCoordinate = uv;
    // World position of this vertex
    vec3 worldSpacePosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 lightDirectionVector = orbPosition - worldSpacePosition;
    vec3 lightDirection = normalize(lightDirectionVector);
    float distanceToLight = length(lightDirectionVector);

    // Gouraud: intensity = |N·L| with attenuation
    float attenuation = 1.0 / (1.0 + 0.0005 * distanceToLight * distanceToLight);
    vec3 worldSpaceNormal = normalize(normalMatrix * normal);
    vLightIntensity = max(abs(dot(worldSpaceNormal, lightDirection)) * attenuation, 0.0);

    // Deformation: attract vertices toward orb when close (magnetic effect)
    float distanceToOrb = distanceToLight;
    float deformationRange = orbRadius + 3.0;
    float deformationFactor = (distanceToOrb < deformationRange && distanceToOrb > 0.0)
        ? 1.0 - smoothstep(orbRadius, deformationRange, distanceToOrb) : 0.0;
    float attractionStrength = 1.2;
    float attractionDistance = deformationFactor * attractionStrength;
    vec3 deformedWorldSpacePosition = deformationFactor > 0.0
        ? worldSpacePosition + lightDirection * attractionDistance
        : worldSpacePosition;

    vWorldSpacePosition = deformedWorldSpacePosition;
    gl_Position = projectionMatrix * viewMatrix * vec4(deformedWorldSpacePosition, 1.0);
}
