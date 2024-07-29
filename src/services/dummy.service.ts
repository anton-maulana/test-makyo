export class DummyService {
    async getProducts() {
        try {
            const response = await  fetch('https://dummyjson.com/products');
            return await response.json();
        } catch (e) {
            //TODO: handle if having error and show notifications for global
        }

    }

}