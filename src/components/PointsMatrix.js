import ColorfulTriangle from './ColorfulTriangle.js'
import Force from './Force.js'
import ColorfulPoint from './ColorfulPoint.js'
import {Vector} from 'ptjs'

class PointsMatrix {
    constructor(width, height, step, forceField, offsetX){
        this._matrix = this.generateMatrix( width + (step*6),
                                            height,
                                            step,
                                            forceField,
                                            offsetX);

    }

    generateMatrix(width, height, step, forceField, offsetX){
        var forces = forceField.map(force => new Force(
            width/100*force.x,
            height/100*force.y,
            force.direction,
            force.intensity,
            force.color,
            width,
            height));
        // this._forces = forces;
        var matrix = [];
        for(let x=0; x<=Math.ceil(width/step); x++){
            var column = [];
            for(let y=0; y<=Math.ceil(height/step); y++){
                var offset = x%2 == 0 ? 0 : step/2;
                var xCoord = x*step + (offsetX%step*2 - step*4);
                var yCoord = y*step;
                var {newX, newY, colorSum} = this._applyForcesToPoint(xCoord, yCoord, forces);
                column.push(new ColorfulPoint(newX, newY, colorSum));
            }
            matrix.push(column);
        }
        return matrix;
    }

    _applyForcesToPoint(x, y, forces){
        var vectorsXSum = 0;
        var vectorsYSum = 0;
        var colorSum = new Vector(0,0,0);
        for(var i in forces){
            var {forceX, forceY, color} = forces[i].getForceAtPoint(x, y);
            vectorsXSum += forceX;
            vectorsYSum += forceY;
            colorSum.add(color);
        }

        var newX = x + vectorsXSum;
        var newY = y + vectorsYSum;
        return {newX, newY, colorSum};
    }

    getMatrix(){
        return this._matrix;
    }

    getFlattenedMatrix(){
        var result = [];
        for(let i in this._matrix){
            result = result.concat(this._matrix[i]);
        }
        return result;
    }

    getTriangle(anchor, pointA, pointB){
        var anchorPoint = this._matrix[anchor[0]][anchor[1]];
        var nextColPoint = this._matrix[pointA[0]][pointA[1]];
        var nextRowPoint = this._matrix[pointB[0]][pointB[1]];
        
        if(!anchorPoint || !nextColPoint || !nextRowPoint) return;
        else return new ColorfulTriangle(anchorPoint, nextColPoint, nextRowPoint);
    }

    getTriangles(){
        var triangles = [];
        for(let col=1; col < this._matrix.length-1; col ++){
            let even = !(col%2);
            for(let row=2; row < this._matrix[col].length-1; row ++){
                if(!even){
                    triangles.push(this.getTriangle([col, row],[col+1,row],[col+1, row+1]));

                    //Triangle on the left
                    triangles.push(this.getTriangle([col, row],[col-1,row],[col-1, row+1]));

                    //Triangle on top
                    triangles.push(this.getTriangle([col, row],[col-1,row],[col+1, row]));

                    //Triangle on bottom
                    triangles.push(this.getTriangle([col, row],[col-1,row-1],[col+1, row-1]));

                    // triangles.push(this.getTriangle([col, row],[col-1,row+1],[col+1, row+1]));
                }
            }
        }
        return triangles;
    }

}

export default PointsMatrix;