// Glove fragment shader: texture lit by orb, proximity cyan (c)
in float vLightIntensity;
in vec3 vWorldSpacePosition;
in vec2 vTextureCoordinate;

uniform vec3 orbPosition;
uniform float orbRadius;
uniform sampler2D gloveColorMap;

void main() {
    vec3 baseColor = vLightIntensity * texture(gloveColorMap, vTextureCoordinate).rgb;
    vec3 cyanColor = vLightIntensity * vec3(0.0, 1.0, 1.0);

    float distanceToOrb = length(vWorldSpacePosition - orbPosition);
    float proximityThreshold = orbRadius + 1.6;

    gl_FragColor = distanceToOrb < proximityThreshold
        ? vec4(cyanColor, 0.8)
        : vec4(baseColor, 1.0);
}
