import * as React from 'react';
import data from './data/db.json';
import Button from './components/Button';
import { src, srcset } from './js/utils';
import './css/StorePicker.css';

const StorePicker: React.FC = () => {
  const [currentStore, setCurrentStore] = React.useState('');
  const ref = React.useRef<HTMLDialogElement>();

  const openDialog = () => {
    ref.current.showModal();
  };

  const selectShop = (e: React.MouseEvent) => {
    const shop = e.currentTarget.getAttribute('data-id');
    setCurrentStore(e.currentTarget.previousElementSibling.innerHTML);
    window.dispatchEvent(
      new CustomEvent('selected-shop', {
        detail: { shop },
      }),
    );
    ref.current.close();
  };

  return (
    <div className="e_StorePicker">
      <div className="e_StorePicker_control" data-boundary="explore">
        <div className="e_StorePicker_selected" dangerouslySetInnerHTML={{ __html: currentStore }} />
        <Button className="e_StorePicker_choose" type="button" onClick={openDialog}>
          choose a store
        </Button>
      </div>
      <dialog className="e_StorePicker_dialog" data-boundary="explore" ref={ref}>
        <div className="e_StorePicker_wrapper">
          <h2>Stores</h2>
          <ul className="e_StorePicker_list">
            {data.stores.map((s, i) => (
              <li className="e_StorePicker_entry" key={i}>
                <div className="e_StorePicker_content">
                  <img
                    className="e_StorePicker_image"
                    src={src(s.image, 200)}
                    srcSet={srcset(s.image, [200, 400])}
                    width="200"
                    height="200"
                  />
                  <p className="e_StorePicker_address">
                    {s.name}
                    <br />
                    {s.street}
                    <br />
                    {s.city}
                  </p>
                </div>
                <Button className="e_StorePicker_select" type="button" dataId={s.id} onClick={selectShop}>
                  select
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </div>
  );
};

export default StorePicker;
