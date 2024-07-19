document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://669a77e99ba098ed61ffc202.mockapi.io/products/cars';
  const carForm = document.getElementById('car-form');
  const carList = document.getElementById('car-list');


  const fetchCars = async () => {
      try {
          const response = await fetch(API_URL);
          const cars = await response.json();
          console.log('Fetched Cars:', cars);
          carList.innerHTML = '';
          cars.forEach(car => {
              const carItem = createCarElement(car);
              carList.appendChild(carItem);
          });
      } catch (error) {
          console.error('Error fetching cars:', error);
      }
  };


  carForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const carName = document.getElementById('car-name').value;
      const carModel = document.getElementById('car-model').value;

      try {
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: carName, model: carModel })
          });
          const newCar = await response.json();
          console.log('New Car:', newCar);
          carList.appendChild(createCarElement(newCar));
          carForm.reset();
      } catch (error) {
          console.error('Error adding car:', error);
      }
  });


  const updateCar = async (id, updatedCar) => {
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedCar)
          });
          const result = await response.json();
          console.log('Updated Car:', result); 
          return result;
      } catch (error) {
          console.error('Error updating car:', error);
      }
  };


  const deleteCar = async (id) => {
      try {
          await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      } catch (error) {
          console.error('Error deleting car:', error);
      }
  };


  const createCarElement = (car) => {
      console.log('Creating element for car:', car); 
      const carItem = document.createElement('li');
      const carName = document.createElement('span');
      carName.textContent = ` ${car.name}`; 
      carItem.appendChild(carName);

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
          const newName = prompt('Enter new car name', car.name);
          const newModel = prompt('Enter new car model', car.model);
          if (newName && newModel) {
              updateCar(car.id, { name: newName, model: newModel }).then(updatedCar => {
                  carName.textContent = `${updatedCar.name} (${updatedCar.model})`;
              });
          }
      });
      carItem.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
          deleteCar(car.id).then(() => {
              carList.removeChild(carItem);
          });
      });
      carItem.appendChild(deleteButton);

      return carItem;
  };


  fetchCars();
});
