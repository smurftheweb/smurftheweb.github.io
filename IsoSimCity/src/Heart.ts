class Heart {
    x: number;
    y: number;

    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
    z_min: number;
    z_max: number;

    radius: number;

    constructor(z_min: number, z_max: number, radius: number) {
        this.z_min = z_min;
        this.z_max = z_max;
        this.radius = radius;
    }
}