function node(data) {
	this.data = data;
	this.next = null;
	this.prev = null;	
}

function linkedList() {
	this.head = new node("head");
	this.tail = new node("tail");
	this.head.next = this.tail;
	this.tail.prev = this.head;
	this.length = 0;
	
	// methods
	this.add = add;
	this.remove = remove;
	this.find = find;
}

function remove(node) {
	var prevNode = node.prev;
	var nextNode = node.next;
	prevNode.next = nextNode;
	nextNode.prev = prevNode;
	this.length--;
}

function add(node) {
	this.tail.prev.next = node;
	node.prev = this.tail.prev;
	node.next = this.tail;
	this.tail.prev = node;
	this.length++;
}

function find(id) {
	var n = this.head.next;
	while (n.next != null) {
		if (n.data[0] == id) {
			return n;
		} else {
			n = n.next;
		}
	}
}

