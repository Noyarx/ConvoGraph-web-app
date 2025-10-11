export default function AddNodeButton({ onClick }: any) {
  return (
    <div id="add-node-button-container" className="">
      <button type="button" onClick={onClick}>
        +
      </button>
    </div>
  );
}
