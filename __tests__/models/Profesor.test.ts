import Profesor from '../../src/models/Profesor';

describe('Profesor Class', () => {
    it('crea una instancia de Profesor con los atributos correctos', () => {
        const nombre = 'Juan';
        const profesor = new Profesor(nombre);

        expect(profesor.nombre).toBe(nombre);
    });
});
